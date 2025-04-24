/* eslint-disable import/prefer-default-export */
export const pageIsActiveInNavigation = (linkText: string): void => {
  cy.get('.moj-side-navigation__item--active a').contains(linkText)
}
