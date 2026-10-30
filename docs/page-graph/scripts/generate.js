/*
 * Builds the page graph docs from:
 *   - scripts/site-navigation.mmd (hand-maintained site navigation diagram)
 *   - scripts/form-pages.json (produced by scripts/extract.js)
 *
 * Writes README.md, index.html and *.mmd diagrams into docs/page-graph.
 */
const fs = require('fs')
const path = require('path')

const outDir = path.resolve(__dirname, '..')
const { sections, scenarios, custodialCohorts } = require('./form-pages.json')
const nav = fs.readFileSync(path.join(__dirname, 'site-navigation.mmd'), 'utf8').trim()

// ---------- conditions ----------
const SCENARIO_TOKENS = /this\.application\.(applicationOrigin|cohort)|this\.body\.cohort|custodialCohorts/g

const isScenarioCond = text => {
  if (!SCENARIO_TOKENS.test(text)) return false
  SCENARIO_TOKENS.lastIndex = 0
  const rest = text.replace(SCENARIO_TOKENS, '').replace(/'[^']*'/g, '')
  return !/this\./.test(rest) && (rest.match(/[A-Za-z_]\w*/g) || []).every(id => id === 'includes')
}

const evaluate = (text, scenario) =>
  // eslint-disable-next-line no-new-func
  new Function(
    'app',
    'custodialCohorts',
    `return ${text.replace(/this\.application\./g, 'app.').replace(/this\.body\.cohort/g, 'app.cohort')}`,
  )(scenario, custodialCohorts)

const condHolds = (cond, scenario) => evaluate(cond.text, scenario) !== cond.negated

const pretty = text =>
  text
    .replace(/this\.application\.data\?\.\['[^']+'\]\?\.\['([^']+)'\]\?\.length > 0/g, 'has saved $1')
    .replace(/custodialCohorts\.includes\(this\.application\.cohort\)/g, 'custodial cohort')
    .replace(/\['courtBail', 'prisonBail'\]\.includes\(this\.application\.applicationOrigin\)/g, 'bail origin')
    .replace(/this\.application\.applicationOrigin/g, 'origin')
    .replace(/this\.(application|body)\.cohort/g, 'cohort')
    .replace(/this\.body\.|this\./g, '')
    .replace(/\s*===\s*'([^']*)'/g, ' = $1')
    .replace(/\s*!==\s*'([^']*)'/g, ' ≠ $1')

const condLabel = ({ text, negated }) => {
  const p = pretty(text)
  if (p.includes('[')) return null // internal lookups (e.g. ethnicGroupNext[...]) are covered by sibling branches
  if (!negated) return p
  if (/ = /.test(p)) return p.replace(' = ', ' ≠ ')
  if (/ ≠ /.test(p)) return p.replace(' ≠ ', ' = ')
  if (p === 'custodial cohort') return 'non-custodial cohort'
  if (p === 'bail origin') return 'non-bail origin'
  if (p.startsWith('has saved ')) return p.replace('has saved', 'no saved')
  return `not ${p}`
}

const branchLabel = conds => {
  if (!conds.length) return ''
  const labels = conds.map(condLabel).filter(Boolean)
  return labels.length ? labels.join(' & ') : 'otherwise'
}

// ---------- scenarios ----------
const shortLabel = s => (s.id === 'from_ap' ? 'From AP' : (/\(([^)]+)\)/.exec(s.label)?.[1] ?? s.label))
const taskApplies = (task, scenario) => !task.isApplicable || evaluate(task.isApplicable, scenario)

const reachable = (start, edges) => {
  const seen = new Set([start])
  const queue = [start]
  while (queue.length) {
    const page = queue.shift()
    edges.filter(e => e.from === page && e.to && !seen.has(e.to)).forEach(e => seen.add(e.to) && queue.push(e.to))
  }
  return seen
}

// A view of the form: which tasks/pages/edges are shown, with branch labels.
const allEdges = task =>
  task.pages.flatMap(page =>
    page.next.map(b => ({ from: page.name, to: b.target, conds: b.conds, branching: page.next.length > 1 })),
  )

const buildView = scenario =>
  sections
    .map(section => ({
      title: section.title,
      tasks: section.tasks
        .filter(task => !scenario || taskApplies(task, scenario))
        .map(task => {
          const edges = allEdges(task)
          if (!scenario) {
            return { ...task, edges: edges.map(e => ({ ...e, label: branchLabel(e.conds) })) }
          }
          const kept = edges
            .filter(e => e.conds.every(c => !isScenarioCond(c.text) || condHolds(c, scenario)))
            .map(e => {
              const remaining = e.conds.filter(c => !isScenarioCond(c.text))
              return { ...e, label: branchLabel(remaining), conds: remaining }
            })
          // drop pages only reachable via branches this scenario never takes; keep pages reached from views
          const everReachable = reachable(task.firstPage, edges)
          const scenarioReachable = reachable(task.firstPage, kept)
          const hidden = new Set([...everReachable].filter(p => !scenarioReachable.has(p)))
          return {
            ...task,
            pages: task.pages.filter(p => !hidden.has(p.name)),
            edges: kept.filter(e => !hidden.has(e.from)).map(e => ({ ...e, branching: kept.filter(k => k.from === e.from).length > 1 })),
          }
        }),
    }))
    .filter(section => section.tasks.length)

const signature = view =>
  JSON.stringify(view.map(s => s.tasks.map(t => [t.slug, t.pages.map(p => p.name), t.edges.map(e => [e.from, e.to, e.label])])))

const groups = []
for (const scenario of scenarios) {
  const view = buildView(scenario)
  const sig = signature(view)
  const existing = groups.find(g => g.sig === sig)
  if (existing) existing.scenarios.push(scenario)
  else groups.push({ sig, view, scenarios: [scenario] })
}
groups.forEach(g => {
  g.name = g.scenarios.map(shortLabel).join(', ')
  g.file = `form-flow-${g.scenarios.map(s => s.id).join('-')}`
})

// ---------- applicability ----------
const bailIds = scenarios.filter(s => s.applicationOrigin !== 'other').map(s => s.id)
const otherIds = scenarios.filter(s => s.applicationOrigin === 'other').map(s => s.id)
const applicability = task => {
  const ids = scenarios.filter(s => taskApplies(task, s)).map(s => s.id)
  const same = ids2 => ids.length === ids2.length && ids2.every(id => ids.includes(id))
  if (ids.length === scenarios.length) return { kind: 'all', text: '' }
  if (same(bailIds)) return { kind: 'bail', text: 'bail only' }
  if (same(otherIds)) return { kind: 'other', text: 'new cohorts only' }
  return { kind: 'mixed', text: scenarios.filter(s => ids.includes(s.id)).map(shortLabel).join(', ') }
}

// ---------- mermaid ----------
const id = (...parts) => parts.join('__').replace(/[^\w]/g, '_')
const q = s => s.replace(/"/g, '#quot;')

const flowchart = (view, { annotate }) => {
  const lines = [
    'flowchart TD',
    '  classDef tl fill:#ffe0b2,stroke:#e65100',
    '  TL(["Task list<br/>/applications/:id"]):::tl',
  ]
  const links = []
  const styles = []
  for (const section of view) {
    lines.push(`  subgraph ${id('s', section.title)}["${q(section.title)}"]`, '    direction TB')
    styles.push(`  style ${id('s', section.title)} fill:#ffffff,stroke:#9e9e9e`)
    for (const task of section.tasks) {
      const appl = annotate ? applicability(task) : { kind: 'all' }
      const badge = appl.text ? `<br/><b>[${appl.text}]</b>` : ''
      lines.push(`    subgraph ${id('t', task.slug)}["${q(task.title)}${badge}"]`, '      direction TB')
      for (const page of task.pages) lines.push(`      ${id(task.slug, page.name)}["${page.name}"]`)
      lines.push(`      ${id(task.slug, 'done')}(["↩ task list"]):::tl`, '    end')
      if (appl.kind === 'all') styles.push(`  style ${id('t', task.slug)} fill:#f5f5f5,stroke:#bdbdbd`)
      if (appl.kind === 'bail') styles.push(`  style ${id('t', task.slug)} fill:#e3f2fd,stroke:#1565c0`)
      if (appl.kind === 'other') styles.push(`  style ${id('t', task.slug)} fill:#fff4ce,stroke:#b58b00`)
      if (appl.kind === 'mixed') styles.push(`  style ${id('t', task.slug)} fill:#fce4ec,stroke:#ad1457`)
    }
    lines.push('  end')
  }
  for (const section of view) {
    for (const task of section.tasks) {
      links.push({ text: `  TL --> ${id(task.slug, task.firstPage)}` })
      for (const e of task.edges.filter(x => x.to !== null)) {
        const from = id(task.slug, e.from)
        const to = id(task.slug, e.to || 'done')
        const arrow = e.branching ? '-.->' : '-->'
        const label = e.label ? `|"${q(e.label)}"|` : ''
        links.push({ text: `  ${from} ${arrow}${label} ${to}`, scenario: e.conds.some(c => isScenarioCond(c.text)) })
      }
    }
  }
  const scenarioLinks = links.map((l, i) => (l.scenario ? i : -1)).filter(i => i >= 0)
  return [
    ...lines,
    ...links.map(l => l.text),
    ...styles,
    ...(scenarioLinks.length ? [`  linkStyle ${scenarioLinks.join(',')} stroke:#d84315,stroke-width:3px,color:#d84315`] : []),
  ].join('\n')
}

const diagrams = [
  { file: 'site-navigation', title: 'Site navigation', mmd: nav },
  { file: 'form-flow-all', title: 'Application form flow (all scenarios)', mmd: flowchart(buildView(null), { annotate: true }) },
  ...groups.map(g => ({ file: g.file, title: `Application form flow: ${g.name}`, mmd: flowchart(g.view, { annotate: false }) })),
]
// Force a light theme and wrap everything in a white container, so diagrams stay legible on GitHub's dark mode.
const THEME = {
  theme: 'base',
  themeVariables: {
    background: '#ffffff',
    primaryColor: '#ffffff',
    primaryBorderColor: '#333333',
    primaryTextColor: '#000000',
    secondaryColor: '#f5f5f5',
    tertiaryColor: '#ffffff',
    lineColor: '#333333',
    textColor: '#000000',
    titleColor: '#000000',
    clusterBkg: '#ffffff',
    clusterBorder: '#9e9e9e',
    edgeLabelBackground: '#ffffff',
  },
}
const withWhiteBackground = mmd => {
  const [header, ...body] = mmd.split('\n')
  const direction = header.trim().split(/\s+/)[1] ?? 'TD'
  const isStyling = l => /^\s*(classDef|style|linkStyle)\b/.test(l)
  return [
    `%%{init: ${JSON.stringify(THEME)}}%%`,
    header,
    '  subgraph PAGE_GRAPH_ROOT[" "]',
    `    direction ${direction}`,
    ...body.filter(l => !isStyling(l)).map(l => `  ${l}`),
    '  end',
    ...body.filter(isStyling),
    '  style PAGE_GRAPH_ROOT fill:#ffffff,stroke:#ffffff',
  ].join('\n')
}
diagrams.forEach(d => {
  d.mmd = withWhiteBackground(d.mmd)
  fs.writeFileSync(path.join(outDir, `${d.file}.mmd`), `${d.mmd}\n`)
})

// ---------- applicability matrix ----------
const matrix = [
  `| Section | Task | ${groups.map(g => g.name).join(' | ')} |`,
  `|---|---|${groups.map(() => ':-:').join('|')}|`,
  ...sections.flatMap(section =>
    section.tasks.map(
      task =>
        `| ${section.title} | ${task.title} | ${groups.map(g => (taskApplies(task, g.scenarios[0]) ? '✓' : '–')).join(' | ')} |`,
    ),
  ),
].join('\n')

const scenarioBranches = sections.flatMap(section =>
  section.tasks.flatMap(task =>
    allEdges(task)
      .filter(e => e.conds.some(c => isScenarioCond(c.text)))
      .map(e => `| ${task.slug} | ${e.from} | ${e.to || '↩ task list'} | ${branchLabel(e.conds)} |`),
  ),
)

// ---------- outputs ----------
const legend = `- Solid arrow: link / button. Dashed arrow: form POST/PUT or server redirect.
- In form flows, dashed arrows are conditional \`next()\` branches, labelled with their condition.
  **Orange, thick arrows depend on the application origin or cohort.**
- Task colours (all-scenarios diagram): blue = bail only, yellow = new cohorts only.
- Yellow nodes in the site navigation are only routed when \`config.flags.cas2IsrEnabled\` is on.`

const md = `# Page graph

Generated by \`docs/page-graph/scripts\` (see [Regenerating](#regenerating)) from \`server/routes\`, \`server/paths\`,
controllers, views and \`server/form-pages/apply\`.

${legend}

Rendered images: ${diagrams.map(d => `[${d.file}.svg](./${d.file}.svg)`).join(', ')}.
Open [index.html](./index.html) in a browser to view all diagrams.

## Contents

${diagrams.map((d, i) => `${i + 1}. [${d.title}](#${i + 1}-${d.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')})`).join('\n')}
${diagrams.length + 1}. [Tasks by application type](#tasks-by-application-type)

${diagrams
  .map(
    (d, i) => `## ${i + 1}. ${d.title}

${i === 1 ? 'Every page and branch, regardless of application type.\n\n' : ''}${
      i > 1
        ? `Only tasks that apply to ${d.title.split(': ')[1]} (via the first page's \`isApplicable()\`), with origin/cohort branches resolved.\n\n`
        : ''
    }\`\`\`mermaid
${d.mmd}
\`\`\``,
  )
  .join('\n\n')}

## Tasks by application type

The application type is \`applicationOrigin\` (\`courtBail\`, \`prisonBail\` or \`other\`). For \`other\`, the
\`cohort\` is chosen on the \`cohort-selection\` page. A task is hidden from the task list (\`not_applicable\`) when its
first page's \`isApplicable()\` returns false. Scenarios that produce identical form flows are grouped into one column.

${matrix}

### Branches that depend on application type

| Task | Page | Next | Condition |
|---|---|---|---|
${scenarioBranches.join('\n')}

Page content (titles, questions) also varies by cohort in places, e.g. \`has-fixed-address\` wording for custodial
cohorts (${custodialCohorts.join(', ')}). That is not shown in the graphs.

## Regenerating

\`\`\`bash
docs/page-graph/scripts/build.sh
\`\`\`

\`scripts/site-navigation.mmd\` is maintained by hand. The form flow diagrams are generated from the \`@Form\`, \`@Section\`,
\`@Task\` and \`@Page\` decorators and each page's \`next()\` and \`isApplicable()\` methods. Where task page order
depends on \`cas2IsrEnabled\`, the flag-on order is used.
`

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/&lt;(\/?(br|b)\/?)>/g, '<$1>')
const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>CAS2 Bail UI – page graph</title>
<style>
  body{font-family:sans-serif;margin:1rem} .mermaid{overflow:auto;border:1px solid #ddd;padding:1rem;margin-bottom:2rem}
  table{border-collapse:collapse} td,th{border:1px solid #ccc;padding:.25rem .5rem} td:not(:nth-child(-n+2)){text-align:center}
</style>
</head><body>
<h1>CAS2 Bail UI – page graph</h1>
<ul>${legend
  .split('\n- ')
  .map(l => `<li>${l.replace(/^- /, '').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')}</li>`)
  .join('')}</ul>
<ol>${diagrams.map(d => `<li><a href="#${d.file}">${d.title}</a></li>`).join('')}<li><a href="#matrix">Tasks by application type</a></li></ol>
${diagrams.map(d => `<h2 id="${d.file}">${d.title}</h2>\n<pre class="mermaid">${esc(d.mmd)}</pre>`).join('\n')}
<h2 id="matrix">Tasks by application type</h2>
<table><tr><th>Section</th><th>Task</th>${groups.map(g => `<th>${g.name}</th>`).join('')}</tr>
${sections
  .flatMap(s =>
    s.tasks.map(
      t => `<tr><td>${s.title}</td><td>${t.title}</td>${groups.map(g => `<td>${taskApplies(t, g.scenarios[0]) ? '✓' : '–'}</td>`).join('')}</tr>`,
    ),
  )
  .join('\n')}
</table>
<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
mermaid.initialize({ startOnLoad: true, maxEdges: 2000, maxTextSize: 500000, flowchart: { useMaxWidth: false } })
</script>
</body></html>
`

fs.writeFileSync(path.join(outDir, 'README.md'), md)
fs.writeFileSync(path.join(outDir, 'index.html'), html)
console.log(`Scenario groups: ${groups.map(g => g.name).join(' | ')}`)
console.log(diagrams.map(d => d.file).join('\n'))
