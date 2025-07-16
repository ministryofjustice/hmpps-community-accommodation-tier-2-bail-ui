import deleteOrphanedFollowOnAnswers from './deleteOrphanedData'

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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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

        expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
      expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
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
      expect(deleteOrphanedFollowOnAnswers(applicationData)).toEqual({
        'health-needs': {
          'learning-difficulties': {
            hasLearningDifficultiesOrNeurodiversityNeeds: 'no',
          },
        },
      })
    })
  })
})
