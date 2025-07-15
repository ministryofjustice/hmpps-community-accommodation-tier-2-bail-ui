export const supportEmail = 'cas2-bail-digital-support@justice.gov.uk'
export const feedbackSurveyUrl =
  'https://forms.office.com/Pages/ResponsePage.aspx?id=KEeHxuZx_kGp4S6MNndq2NtvFPlxdrJCkJv4UnD6fG1UQzBGV0E1ODM5OE1JWU43S05NQVNNR1hUNS4u'

export const getContent = () => {
  return `This is a new service. <a class="govuk-link" rel="noreferrer noopener" target="_blank" href="${feedbackSurveyUrl}">Complete our feedback form</a> (opens in new tab) or <a class="govuk-link" href="mailto:${supportEmail}">email us</a> (${supportEmail}) to report a bug`
}
