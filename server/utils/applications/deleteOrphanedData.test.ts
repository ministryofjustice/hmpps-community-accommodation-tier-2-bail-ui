import { Cas2Application, Cas2CohortDto } from '@approved-premises/api'
import deleteOrphanedFollowOnAnswers from './deleteOrphanedData'
import { applicationFactory } from '../../testutils/factories'

describe('deleteOrphanedFollowOnAnswers', () => {
  describe('funding-information', () => {
    describe('when applicant ID is not "None"', () => {
      const applicationData = {
        'funding-information': {
          'funding-cas2-accommodation': {
            fundingSource: 'personalSavings',
          },
          'applicant-id': {
            idDocuments: 'passport',
          },
          'alternative-applicant-id': {
            alternativeIDDocuments: 'citizenCard',
          },
        },
      }

      it('removes alternative-identification data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'funding-information': {
            'funding-cas2-accommodation': {
              fundingSource: 'personalSavings',
            },
            'applicant-id': {
              idDocuments: 'passport',
            },
          },
        })
      })
    })
  })

  describe('equality-and-diversity-monitoring', () => {
    describe('when willAnswer is set to no', () => {
      const applicationData = {
        'equality-and-diversity-monitoring': {
          'will-answer-equality-questions': {
            willAnswer: 'no',
          },
          disability: {
            hasDisability: 'no',
          },
          'sex-and-gender': {
            sex: 'female',
            gender: 'yes',
          },
          'sexual-orientation': {
            orientation: 'gay',
          },
          'ethnic-group': {
            ethnicGroup: 'white',
          },
          'white-background': {
            whiteBackground: 'english',
          },
          religion: {
            religion: 'atheist',
          },
          'military-veteran': {
            isVeteran: 'yes',
          },
          'care-leaver': {
            isCareLeaver: 'no',
          },
          'parental-carer-responsibilities': {
            hasParentalOrCarerResponsibilities: 'yes',
          },
          'marital-status': {
            maritalStatus: 'widowed',
          },
        },
      }

      it('removes all equality and diversity data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'equality-and-diversity-monitoring': {
            'will-answer-equality-questions': {
              willAnswer: 'no',
            },
          },
        })
      })
    })
  })

  describe('previous-unspent-convictions', () => {
    describe('when hasAnyPreviousConvictions is set to no', () => {
      const applicationData = {
        'previous-unspent-convictions': {
          'any-previous-convictions': { hasAnyPreviousConvictions: 'no' },
          'unspent-convictions-data': [
            {
              offenceGroupName: 'Arson (09000)',
              offenceCategory: 'Arson',
              'offenceDate-day': '5',
              'offenceDate-month': '6',
              'offenceDate-year': '1940',
              sentenceLength: '3 years',
              summary: 'summary detail',
            },
            {
              offenceGroupName: 'Stalking (08000)',
              offenceCategory: 'Stalking',
              'offenceDate-day': '6',
              'offenceDate-month': '7',
              'offenceDate-year': '2023',
              sentenceLength: '2 months',
              summary: 'more summary detail',
            },
          ],
          'unspent-convictions': {},
        },
      }

      it('removes unspent convictions data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'previous-unspent-convictions': {
            'any-previous-convictions': { hasAnyPreviousConvictions: 'no' },
            'unspent-convictions': {},
          },
        })
      })
    })

    describe('when hasAnyPreviousConvictions is set to yesNoRelevantRisk', () => {
      const applicationData = {
        'previous-unspent-convictions': {
          'any-previous-convictions': { hasAnyPreviousConvictions: 'yesNoRelevantRisk' },
          'unspent-convictions-data': [
            {
              offenceGroupName: 'Arson (09000)',
              offenceCategory: 'Arson',
              'offenceDate-day': '5',
              'offenceDate-month': '6',
              'offenceDate-year': '1940',
              sentenceLength: '3 years',
              summary: 'summary detail',
            },
            {
              offenceGroupName: 'Stalking (08000)',
              offenceCategory: 'Stalking',
              'offenceDate-day': '6',
              'offenceDate-month': '7',
              'offenceDate-year': '2023',
              sentenceLength: '2 months',
              summary: 'more summary detail',
            },
          ],
          'unspent-convictions': {},
        },
      }

      it('removes unspent convictions data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'previous-unspent-convictions': {
            'any-previous-convictions': { hasAnyPreviousConvictions: 'yesNoRelevantRisk' },
            'unspent-convictions': {},
          },
        })
      })
    })
  })

  describe('community-probation-practitioner-details and serious harm risk level pages', () => {
    describe('when probation supervision is set to no', () => {
      const applicationData = {
        'add-probation-supervision-details': {
          'supervised-by-probation': {
            probationSupervision: 'no',
          },
          'community-probation-practitioner-details': {
            cppDetails: {
              name: 'A. CPP',
              probationRegion: 'some region',
              email: 'cpp@moj.gov.uk',
              telephone: '012345',
            },
          },
          'contacted-cpp-about-current-risk-levels': {
            hasContactedCppAboutCurrentRiskLevels: 'yes',
            contactDate: '2024-10-01',
            'contactDate-day': '01',
            'contactDate-month': '10',
            'contactDate-year': '2024',
          },
          'serious-harm-risk-levels': {
            riskToChildren: 'low',
            riskToPublic: 'low',
            riskToKnownAdults: 'low',
            riskToStaff: 'low',
            overallRiskLevel: 'low',
          },
        },
      }

      it('removes community-probation-practitioner-details and serious harm risk level pages data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'add-probation-supervision-details': {
            'supervised-by-probation': {
              probationSupervision: 'no',
            },
          },
        })
      })
    })
  })

  describe('serious harm risk levels', () => {
    describe('when the CPP has not been contacted ', () => {
      const applicationData = {
        'add-probation-supervision-details': {
          'contacted-cpp-about-current-risk-levels': {
            hasContactedCppAboutCurrentRiskLevels: 'no',
          },
          'serious-harm-risk-levels': {
            riskToChildren: 'low',
            riskToPublic: 'low',
            riskToKnownAdults: 'low',
            riskToStaff: 'low',
            overallRiskLevel: 'low',
          },
        },
      }

      it('removes the risk level data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'add-probation-supervision-details': {
            'contacted-cpp-about-current-risk-levels': {
              hasContactedCppAboutCurrentRiskLevels: 'no',
            },
          },
        })
      })
    })
  })

  describe('ACCT notes', () => {
    describe('when the applicant is not in prison custody', () => {
      const applicationData = {
        'risk-information': {
          'does-the-applicant-have-acct-notes': {
            applicantHasAcctNotes: 'notInPrisonCustody',
          },
          'add-acct-note': [
            {
              'createdDate-day': '1',
              'createdDate-month': '2',
              'createdDate-year': '2012',
              isOngoing: 'no',
              'closedDate-day': '10',
              'closedDate-month': '10',
              'closedDate-year': '2013',
              referringInstitution: 'HMPPS prison',
              acctDetails: 'ACCT details\nsome more details on another line',
            },
          ],
        },
      }

      it('removes the ACCT notes', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'risk-information': {
            'does-the-applicant-have-acct-notes': {
              applicantHasAcctNotes: 'notInPrisonCustody',
            },
          },
        })
      })
    })

    describe('when the applicant does not have ACCT notes', () => {
      const applicationData = {
        'risk-information': {
          'does-the-applicant-have-acct-notes': {
            applicantHasAcctNotes: 'no',
          },
          'add-acct-note': [
            {
              'createdDate-day': '1',
              'createdDate-month': '2',
              'createdDate-year': '2012',
              isOngoing: 'no',
              'closedDate-day': '10',
              'closedDate-month': '10',
              'closedDate-year': '2013',
              referringInstitution: 'HMPPS prison',
              acctDetails: 'ACCT details\nsome more details on another line',
            },
          ],
        },
      }

      it('removes the ACCT notes', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'risk-information': {
            'does-the-applicant-have-acct-notes': {
              applicantHasAcctNotes: 'no',
            },
          },
        })
      })
    })
  })

  describe('Domestic abuse', () => {
    describe('when there are no concerns around domestic abuse', () => {
      const applicationData = {
        'risk-information': {
          'domestic-abuse-concerns': {
            areConcerns: 'no',
          },
          'details-of-domestic-abuse-concerns': {
            victimDetails: 'details about victims',
            safeguarding: 'yes',
            safeguardingDetail: 'details about safeguarding',
          },
        },
      }

      it('removes the domestic abuse concern details data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'risk-information': {
            'domestic-abuse-concerns': {
              areConcerns: 'no',
            },
          },
        })
      })
    })
  })

  describe('health needs relevancy checks', () => {
    describe('communication and language needs', () => {
      it('removes communication and language needs data when it is no longer relevant', () => {
        const applicationData = {
          'health-needs': {
            'communication-and-language-relevance-check': {
              hasCommunicationAndLanguageNeeds: 'no',
            },
            'communication-and-language': {
              hasImpairments: 'yes',
              impairmentsDetail: 'impairments detail',
              requiresInterpreter: 'yes',
              interpretationDetail: 'interpretation detail',
            },
          },
        }

        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'health-needs': {
            'communication-and-language-relevance-check': {
              hasCommunicationAndLanguageNeeds: 'no',
            },
          },
        })
      })
    })
  })

  describe('when the referrer confirms the applicant does not have a brain injury', () => {
    const applicationData = {
      'health-needs': {
        'brain-injury': {
          hasBrainInjury: 'no',
        },
        'brain-injury-details': {
          injuryDetail: 'some details',
          supportNeeded: 'no',
          supportDetail: '',
          receivingTreatment: 'yes',
          treatmentDetail: 'some treatment details',
          isVulnerable: 'no',
          vulnerabilityDetail: '',
          hasDifficultyInteracting: 'no',
          interactionDetail: '',
        },
      },
    }

    it('removes the brain injury details', () => {
      expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
        'health-needs': {
          'brain-injury': {
            hasBrainInjury: 'no',
          },
        },
      })
    })
  })

  describe('when the referrer confirms the applicant does not learning difficulties or neurodiversity needs', () => {
    const applicationData = {
      'health-needs': {
        'learning-difficulties': {
          hasLearningDifficultiesOrNeurodiversityNeeds: 'no',
        },
        'learning-difficulties-details': {
          learningNeedsDetail: 'some learning needs details',
          needsSupport: 'yes',
          supportDetail: 'some support details',
          receivesTreatment: 'yes',
          treatmentDetail: 'some treatment details',
          isVulnerable: 'yes',
          vulnerabilityDetail: 'some vulnerability details',
        },
      },
    }

    it('removes the learning difficulties details', () => {
      expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
        'health-needs': {
          'learning-difficulties': {
            hasLearningDifficultiesOrNeurodiversityNeeds: 'no',
          },
        },
      })
    })
  })

  describe('Removes orphaned licence data according to cohort', () => {
    const expandDate = (key: string): Record<string, string> => ({
      [`${key}-day`]: 'd',
      [`${key}-month`]: 'm',
      [`${key}-year`]: 'y',
    })

    const licenceStarDate = expandDate('licenceStartDate')
    const licenceEndDate = expandDate('licenceEndDate')
    const hdcEligibilityDate = { ...expandDate('hdcExpiryDate'), hasHdcExpiryDate: 'yes' }

    const allLicenceDates = { ...licenceStarDate, ...licenceEndDate, ...hdcEligibilityDate }

    const applicationData = (cohort: Cas2CohortDto, licenceDates: Record<string, string>): Cas2Application => {
      return applicationFactory.build({
        cohort,
        data: {
          'cohort-selection': {
            'cohort-selection': { cohort },
            'licence-dates': { ...licenceDates },
          },
        },
      })
    }

    it('removes the start date and hdcEligiilityDate if cohort is rarr', () => {
      expect(deleteOrphanedFollowOnAnswers(applicationData('rarr', allLicenceDates))).toEqual(
        applicationData('rarr', { ...licenceEndDate }).data,
      )
    })

    it('leaves the hdcEligibility date if cohort is atcr', () => {
      expect(deleteOrphanedFollowOnAnswers(applicationData('atcr', allLicenceDates))).toEqual(
        applicationData('atcr', allLicenceDates).data,
      )
    })

    it('removes the hdcExpiry date if cohort is hcrd', () => {
      expect(deleteOrphanedFollowOnAnswers(applicationData('hcrd', allLicenceDates))).toEqual(
        applicationData('hcrd', { ...licenceEndDate, ...licenceStarDate }).data,
      )
    })

    it('removes all licence dates if licenceDatesNeeded is no', () => {
      const application = applicationData('isc', allLicenceDates)
      application.data['cohort-selection'] = {
        ...application.data['cohort-selection'],
        'licence-dates-needed': { licenceDatesNeeded: 'no' },
      }
      const expected = {
        'cohort-selection': { ...application.data['cohort-selection'], 'licence-dates': undefined as unknown },
      }
      expect(deleteOrphanedFollowOnAnswers(application)).toEqual(expected)
    })
  })

  describe('address-history', () => {
    describe('when the applicant did not have a fixed address before custody', () => {
      const applicationData = {
        'address-history': {
          'has-fixed-address-before-custody': {
            hasFixedAddressBeforeCustody: 'no',
          },
          'last-fixed-address': {
            addressLine1: 'some address line 1',
            townOrCity: 'some town or city',
            postcode: 'some postcode',
          },
        },
      }

      it('removes the last-fixed-address data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'address-history': {
            'has-fixed-address-before-custody': {
              hasFixedAddressBeforeCustody: 'no',
            },
          },
        })
      })
    })

    describe('when the applicant did have a fixed address before custody', () => {
      const applicationData = {
        'address-history': {
          'has-fixed-address-before-custody': {
            hasFixedAddressBeforeCustody: 'yes',
          },
          'no-fixed-address': {
            howLong: 'some duration',
            lastKnownAddressLine1: 'some address line 1',
            lastKnownTownOrCity: 'some town or city',
            lastKnownPostcode: 'some postcode',
          },
        },
      }

      it('removes the no-fixed-address data', () => {
        expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data: applicationData }))).toEqual({
          'address-history': {
            'has-fixed-address-before-custody': {
              hasFixedAddressBeforeCustody: 'yes',
            },
          },
        })
      })
    })
  })

  describe('Personal information', () => {
    it('it removes custody location for non-custodial cohorts', () => {
      const data = {
        'personal-information': {
          'custody-location': { custodyLocation: 'HMP Slade' },
        },
      }
      const expected = { ...data, 'personal-information': { 'custody-location': undefined as Record<string, unknown> } }
      expect(deleteOrphanedFollowOnAnswers(applicationFactory.build({ data, cohort: 'isc' }))).toEqual(expected)
    })
  })
})
