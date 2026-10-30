/*
 * Extracts the application form structure from server/form-pages/apply:
 *   sections -> tasks -> pages, each page's next() branches (with the conditions guarding them)
 *   and each task's applicability (first page's isApplicable()).
 *
 * Writes form-pages.json next to this script.
 */
const fs = require('fs')
const path = require('path')
const ts = require('typescript')

const repoRoot = path.resolve(__dirname, '../../..')
const applyRoot = path.join(repoRoot, 'server/form-pages/apply')

const parse = file => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)

const findDecoratorArg = (sf, decorator) => {
  let found
  const visit = node => {
    if (
      ts.isDecorator(node) &&
      ts.isCallExpression(node.expression) &&
      node.expression.expression.getText(sf) === decorator
    ) {
      ;[found] = node.expression.arguments
    }
    if (!found) ts.forEachChild(node, visit)
  }
  visit(sf)
  return found
}

const prop = (obj, name) => obj?.properties.find(p => p.name?.getText() === name)?.initializer

const relativeImports = sf =>
  Object.fromEntries(
    sf.statements
      .filter(s => ts.isImportDeclaration(s) && s.importClause?.name && s.moduleSpecifier.text.startsWith('./'))
      .map(s => [s.importClause.name.text, s.moduleSpecifier.text]),
  )

const findMethod = (sf, name) => {
  let found
  const visit = node => {
    if (ts.isMethodDeclaration(node) && node.name.getText(sf) === name) found = node
    if (!found) ts.forEachChild(node, visit)
  }
  visit(sf)
  return found
}

const unwrap = e => {
  let expr = e
  while (ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr)) expr = expr.expression
  return expr
}

// Walks a method body, returning every possible return value with the conditions that lead to it.
const branches = (method, sf) => {
  const out = []
  const locals = {}

  const fromExpr = (e, conds) => {
    const expr = unwrap(e)
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
      out.push({ target: expr.text, conds })
    } else if (ts.isConditionalExpression(expr)) {
      const c = expr.condition.getText(sf)
      fromExpr(expr.whenTrue, [...conds, { text: c, negated: false }])
      fromExpr(expr.whenFalse, [...conds, { text: c, negated: true }])
    } else if (ts.isElementAccessExpression(expr) && ts.isIdentifier(expr.expression)) {
      // lookup table: `const map = { a: 'page-a' }; return map[key]`
      const table = locals[expr.expression.text]
      const keyExpr = locals[expr.argumentExpression.getText(sf)] ?? expr.argumentExpression
      table?.properties.forEach(p =>
        out.push({
          target: p.initializer.text,
          conds: [...conds, { text: `${unwrap(keyExpr).getText(sf)} === '${p.name.getText(sf)}'`, negated: false }],
        }),
      )
    } else {
      out.push({ target: null, conds, dynamic: expr.getText(sf) })
    }
  }

  const fromStatements = (stmts, conds) => {
    for (let i = 0; i < stmts.length; i += 1) {
      const s = stmts[i]
      if (ts.isVariableStatement(s)) {
        s.declarationList.declarations.forEach(d => {
          locals[d.name.getText(sf)] = unwrap(d.initializer)
        })
      } else if (ts.isReturnStatement(s)) {
        if (s.expression) fromExpr(s.expression, conds)
        return
      } else if (ts.isIfStatement(s)) {
        const c = { text: s.expression.getText(sf), negated: false }
        const thenStmts = ts.isBlock(s.thenStatement) ? [...s.thenStatement.statements] : [s.thenStatement]
        fromStatements(thenStmts, [...conds, c])
        const rest = s.elseStatement
          ? [...(ts.isBlock(s.elseStatement) ? s.elseStatement.statements : [s.elseStatement]), ...stmts.slice(i + 1)]
          : stmts.slice(i + 1)
        fromStatements(rest, [...conds, { ...c, negated: true }])
        return
      }
    }
  }

  if (method?.body) fromStatements([...method.body.statements], [])
  return out
}

const readPage = file => {
  const sf = parse(file)
  const meta = findDecoratorArg(sf, 'Page')
  if (!meta) return null
  const isApplicable = findMethod(sf, 'isApplicable')
  const applicableReturn = isApplicable?.body.statements.find(ts.isReturnStatement)
  return {
    name: prop(meta, 'name').text,
    next: branches(findMethod(sf, 'next'), sf),
    isApplicable: applicableReturn ? applicableReturn.expression.getText(sf) : null,
  }
}

const readTask = dir => {
  const index = path.join(dir, 'index.ts')
  const sf = parse(index)
  const meta = findDecoratorArg(sf, 'Task')
  const imports = relativeImports(sf)
  let pagesExpr = prop(meta, 'pages')
  // flag-dependent ordering, e.g. `config.flags.cas2IsrEnabled ? [A, B] : [B, A]` -> use the flag-on ordering
  if (ts.isConditionalExpression(pagesExpr)) pagesExpr = pagesExpr.whenTrue
  const pages = pagesExpr.elements.map(el => readPage(path.join(dir, `${imports[el.getText(sf)]}.ts`)))
  return {
    slug: prop(meta, 'slug').text,
    title: prop(meta, 'name').text,
    pages,
    firstPage: pages[0].name,
    isApplicable: pages[0].isApplicable,
  }
}

const readContainer = (dir, decorator, key) => {
  const sf = parse(path.join(dir, 'index.ts'))
  const meta = findDecoratorArg(sf, decorator)
  const imports = relativeImports(sf)
  return {
    title: prop(meta, 'title')?.text,
    children: prop(meta, key).elements.map(el => path.join(dir, imports[el.getText(sf)])),
  }
}

const form = readContainer(applyRoot, 'Form', 'sections')
const sections = form.children.map(sectionDir => {
  const section = readContainer(sectionDir, 'Section', 'tasks')
  return { title: section.title, tasks: section.children.map(readTask) }
})

// scenarios: one per bail origin, plus one per non-bail cohort (server/utils/applications/cohortLabels.ts)
const cohortSrc = fs.readFileSync(path.join(repoRoot, 'server/utils/applications/cohortLabels.ts'), 'utf8')
const block = name => new RegExp(`${name}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`).exec(cohortSrc)[1]
const newCohorts = [...block('newCohortLabels').matchAll(/^\s*(\w+):\s*'([^']+)'/gm)].map(m => ({
  cohort: m[1],
  label: m[2],
}))
const custodialCohorts = JSON.parse(
  /custodialCohorts[^=]*=\s*(\[[^\]]*\])/.exec(cohortSrc)[1].replace(/'/g, '"').replace(/,\s*\]/, ']'),
)

const scenarios = [
  { id: 'courtBail', label: 'Court bail', applicationOrigin: 'courtBail', cohort: 'courtBail' },
  { id: 'prisonBail', label: 'Prison bail', applicationOrigin: 'prisonBail', cohort: 'prisonBail' },
  ...newCohorts.map(c => ({ id: c.cohort, label: c.label, applicationOrigin: 'other', cohort: c.cohort })),
]

fs.writeFileSync(
  path.join(__dirname, 'form-pages.json'),
  JSON.stringify({ sections, scenarios, custodialCohorts }, null, 2),
)

const pageCount = sections.reduce((n, s) => n + s.tasks.reduce((m, t) => m + t.pages.length, 0), 0)
console.log(`Extracted ${sections.length} sections, ${pageCount} pages, ${scenarios.length} scenarios`)
