import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import FundingCas2Accommodation, { FundingCas2AccommodationBody } from './fundingCas2Accommodation'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('FundingCas2Accommodation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the title', () => {
      const page = new FundingCas2Accommodation({ fundingSource: 'personalSavings' }, application)

      expect(page.title).toEqual('Funding CAS-2 accommodation')
    })
  })

  it('should set the body', () => {
    const page = new FundingCas2Accommodation(
      {
        fundingSource: 'personalSavings',
        fundingSourceDetail: 'Funding source details',
        hasNationalInsuranceNumber: 'yes',
        nationalInsuranceNumber: 'SF123456X',
        receivingBenefits: 'yes',
        receivedBenefitSanctions: 'no',
        inEducationOrTraining: 'yes',
      },
      application,
    )

    expect(page.body).toEqual({
      fundingSource: 'personalSavings',
      fundingSourceDetail: 'Funding source details',
      hasNationalInsuranceNumber: 'yes',
      nationalInsuranceNumber: 'SF123456X',
      receivingBenefits: 'yes',
      receivedBenefitSanctions: 'no',
      inEducationOrTraining: 'yes',
    } as FundingCas2AccommodationBody)
  })

  itShouldHaveNextValue(new FundingCas2Accommodation({ fundingSource: 'personalSavings' }, application), '')
  itShouldHaveNextValue(new FundingCas2Accommodation({ fundingSource: 'benefits' }, application), 'identification')
  itShouldHavePreviousValue(new FundingCas2Accommodation({ fundingSource: 'personalSavings' }, application), 'taskList')

  describe('errors', () => {
    it('should return errors when yes/no questions are blank', () => {
      const page = new FundingCas2Accommodation({}, application)

      expect(page.errors()).toEqual({
        fundingSource: 'Select how the applicant will pay for their accommodation and the service charge',
        hasNationalInsuranceNumber: 'Select if the applicant has a National Insurance number',
        receivingBenefits: 'Select if the applicant is currently receiving any benefits',
        inEducationOrTraining: 'Select if the applicant is currently in education or receiving any training',
      })
    })

    describe('when receiving benefits question is answered', () => {
      it('should return an error when benefit sanctions question is left blank', () => {
        const page = new FundingCas2Accommodation(
          {
            fundingSource: 'personalSavings',
            fundingSourceDetail: 'Funding source details',
            hasNationalInsuranceNumber: 'yes',
            nationalInsuranceNumber: 'SF123456X',
            receivingBenefits: 'yes',
            receivedBenefitSanctions: null,
            inEducationOrTraining: 'yes',
          },
          application,
        )

        expect(page.errors()).toEqual({
          receivedBenefitSanctions: 'Select if the applicant has received any benefit sanctions in the last 6 months',
        })
      })
    })
  })
})
