export type TestOptions = {
  person: {
    crn: string
    name: string
    nomsNumber: string
  }
  personWithoutOasys: {
    crn: string
    name: string
    nomsNumber: string
  }
  adminUser: {
    name: string
    username: string
    password: string
  }
  assessorUser: {
    name: string
    username: string
    password: string
  }
  miUser: {
    name: string
    username: string
    password: string
  }
  nomisCourtUser: {
    name: string
    username: string
    password: string
  }
  nomisPrisonUser: {
    name: string
    username: string
    password: string
  }
}
