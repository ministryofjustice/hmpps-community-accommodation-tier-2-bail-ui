export const supportEmail = 'cas2-bail-digital-support@justice.gov.uk'
const serviceDeskLink =
  'https://mojprod.service-now.com/moj_sp?id=sc_cat_item&table=sc_cat_item&sys_id=5a2f4eff1bbf1690a1e2ddf0b24bcb34'
export const feedbackSurveyUrl =
  'https://forms.office.com/Pages/ResponsePage.aspx?id=KEeHxuZx_kGp4S6MNndq2NtvFPlxdrJCkJv4UnD6fG1UQzBGV0E1ODM5OE1JWU43S05NQVNNR1hUNS4u'

export const getContent = () => {
  return `This is a new service. <a class="govuk-link" rel="noreferrer noopener" target="_blank" href="${feedbackSurveyUrl}">Complete our feedback form (opens in new tab).</a> To get help or report a bug: for <b>court bail applications</b>, email <a class="govuk-link" href="mailto:${supportEmail}">${supportEmail}</a> or for <b>prison bail applications</b>, contact the Service Desk (open <a class="govuk-link" href="${serviceDeskLink}">a support ticket</a> or call 0800 917 5148 or #6598 from inside an establishment).`
}
