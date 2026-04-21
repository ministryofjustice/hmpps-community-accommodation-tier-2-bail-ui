export const fieldIsOptional = (labelId: string): void => {
  cy.get(`label[for="${labelId}"]`).contains('(optional)')
}
