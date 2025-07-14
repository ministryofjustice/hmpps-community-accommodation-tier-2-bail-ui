import { getContent } from './phaseBannerUtils'

describe('PhaseBannerUtils', () => {
  it('returns the phase banner content', () => {
    const feedbackSurveyUrl =
      'https://forms.office.com/Pages/ResponsePage.aspx?id=KEeHxuZx_kGp4S6MNndq2NtvFPlxdrJCkJv4UnD6fG1UQzBGV0E1ODM5OE1JWU43S05NQVNNR1hUNS4u'
    const content = `This is a new service. <a class="govuk-link" rel="noreferrer noopener" target="_blank" href="${feedbackSurveyUrl}">Complete our feedback form</a> (opens in new tab) or <a class="govuk-link" href="mailto:cas2-bail-digital-support@justice.gov.uk">email us</a> (cas2-bail-digital-support@justice.gov.uk) to report a bug`

    expect(getContent()).toEqual(content)
  })
})
