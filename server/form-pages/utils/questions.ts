/* eslint-disable import/prefer-default-export */

export const getQuestions = (name: string) => {
  const yesOrNo = { yes: 'Yes', no: 'No' }
  const yesNoOrIDontKnow = { yes: 'Yes', no: 'No', dontKnow: `I don't know` }
  const riskLevelAnswers = {
    veryHigh: 'Very high risk',
    high: 'High risk',
    medium: 'Medium risk',
    low: 'Low risk',
  }

  const dateExample = '27 3 2023'

  const offenceCategory = {
    question: 'Offence type',
    answers: {
      stalkingOrHarassment: 'Stalking or Harassment',
      weaponsOrFirearms: 'Weapons or Firearms',
      arson: 'Arson',
      violence: 'Violence',
      domesticAbuse: 'Domestic abuse',
      hateCrime: 'Hate crime',
      drugs: 'Drugs',
      other: 'Other',
    },
  }

  return {
    'confirm-eligibility': {
      'confirm-eligibility': {
        isEligible: {
          question: 'Is the applicant eligible for this service?',
          answers: {
            yes: 'Yes, they are',
            no: 'No, they are not',
          },
        },
      },
    },
    'confirm-consent': {
      'confirm-consent': {
        hasGivenConsent: {
          question: `Has ${name} given their verbal consent to apply for short-term accommodation (CAS2) for bail?`,
          answers: {
            yes: `Yes`,
            no: `No, they do not give verbal consent`,
          },
        },
        consentDate: {
          question: 'When did they give consent?',
          hint: `For example, ${dateExample}`,
        },
      },
    },
    'referrer-details': {
      'confirm-details': {
        name: { question: 'Name' },
        email: { question: 'Email address' },
      },
      'job-title': {
        jobTitle: { question: 'What is your job title?', hint: 'For example, Bail Information Officer (BIO)' },
      },
      'contact-number': {
        telephone: {
          question: 'What is your contact telephone number?',
          hint: 'This will be used for any communication from the accommodation supplier',
        },
      },
      location: {
        location: {
          question: 'Where are you based?',
          hint: "For example, Sefton Magistrates' Court or Full Sutton Prison.",
        },
      },
    },
    'solicitor-details': {
      'has-solicitor': {
        hasSolicitor: {
          question: `Does ${name} have a solicitor?`,
          answers: yesOrNo,
        },
      },
      'contact-information': {
        contactInformation: {
          question: "Add solicitor's contact information",
        },
      },
    },
    'personal-information': {
      'custody-location': {
        custodyLocation: {
          question: `Where is ${name} being held in custody?`,
          hint: "For example, Sefton Magistrates' Court or Full Sutton Prison",
        },
      },
      'working-mobile-phone': {
        hasWorkingMobilePhone: {
          question: `Will ${name} have a working mobile phone?`,
          answers: yesNoOrIDontKnow,
        },
        mobilePhoneNumber: {
          question: 'What is their mobile number? (Optional)',
        },
        isSmartPhone: {
          question: 'Is their mobile a smart phone?',
          answers: yesOrNo,
        },
      },
      'immigration-status': {
        immigrationStatus: {
          question: `What is ${name}'s immigration status?`,
          hint: 'Select their immigration status',
          answers: {
            ukCitizen: 'UK citizen',
            leaveToRemain: 'Leave to remain',
            indefiniteLeaveToRemain: 'Indefinite leave to remain',
            discretionaryLeaveToRemain: 'Discretionary leave to remain',
            eeaNational: 'EEA national',
            refugee: 'Refugee',
            asylumSeekerAwaitingDecision: 'Asylum seeker awaiting decision',
            spousePartnerSponsorship: 'Spouse or partner sponsorship',
            workVisa: 'Work visa',
            studyVisa: 'Study visa',
            notKnown: 'Not known',
          },
        },
      },
      'pregnancy-information': {
        isPregnant: {
          question: `Is ${name} pregnant?`,
          answers: yesNoOrIDontKnow,
        },
        dueDate: {
          question: 'When is their due date?',
          hint: `For example, ${dateExample}`,
        },
      },
      gender: {
        gender: {
          question: `Is the gender ${name} identifies with the same as the sex registered at birth?`,
          answers: {
            yes: 'Yes',
            no: 'No',
            preferNotToSay: 'Prefer not to say',
          },
        },
        genderIdentity: {
          question: 'What is their gender identity? (optional)',
        },
      },
    },
    'address-history': {
      'previous-address': {
        hasPreviousAddress: {
          question: `Did ${name} have a fixed address before being arrested?`,
          answers: {
            yes: 'Yes',
            no: 'No',
          },
        },
        previousAddress: {
          question: 'Enter their last fixed address',
        },
        lastKnownAddress: {
          question: 'Enter their last known fixed address (optional)',
        },
        howLong: {
          question: 'How long have they had no fixed address for?',
          hint: 'For example, one year or six weeks',
        },
        latestLivingSituation: {
          question: 'Which of the following best describes their latest living situation?',
          answers: {
            rentalOrOwnedAlone: 'Living on their own in a rented or owned property (house, flat, trailer, etc)',
            rentalOrOwnedWithOthers: 'Living in a rented or owned property with other people',
            supportedAccommodation: 'Living in supported accommodation',
            sharedAccommodation: 'Living in shared accommodation',
            withRelativeOrFriend: 'Living with a relative or friend',
            temporaryAccommodation: 'Living in temporary accommodation',
            homeless: 'Homeless',
            other: 'Other',
          },
        },
        otherLivingSituation: {
          question: 'Enter details',
        },
      },
    },
    'equality-and-diversity-monitoring': {
      'will-answer-equality-questions': {
        willAnswer: {
          question: `Equality questions for ${name}`,
          answers: {
            yes: 'Yes, answer the equality questions (takes 2 minutes)',
            no: 'No, skip the equality questions',
          },
        },
      },
      disability: {
        hasDisability: {
          question: `Does ${name} have a disability?`,
          answers: {
            yes: 'Yes',
            no: 'No',
            preferNotToSay: 'Prefer not to say',
          },
        },
        typeOfDisability: {
          question: `What type of disability?`,
          hint: 'Select all that apply',
          answers: {
            sensoryImpairment: 'Sensory impairment',
            physicalImpairment: 'Physical impairment',
            learningDisability: 'Learning disability or difficulty',
            mentalHealth: 'Mental health condition',
            illness: 'Long-standing illness',
            other: 'Other',
          },
        },
        otherDisability: { question: 'What is the disability?' },
      },
      'sex-and-gender': {
        sex: {
          question: `What is ${name}'s sex?`,
          answers: {
            female: 'Female',
            male: 'Male',
            preferNotToSay: 'Prefer not to say',
          },
        },
        gender: {
          question: `Is the gender ${name} identifies with the same as the sex registered at birth?`,
          answers: {
            yes: 'Yes',
            no: 'No',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalGenderIdentity: { question: 'What is their gender identity? (optional)' },
      },
      'sexual-orientation': {
        orientation: {
          question: `Which of the following best describes ${name}'s sexual orientation?`,
          answers: {
            heterosexual: 'Heterosexual or straight',
            gay: 'Gay',
            lesbian: 'Lesbian',
            bisexual: 'Bisexual',
            other: 'Other',
            preferNotToSay: 'Prefer not to say',
          },
        },
        otherOrientation: { question: 'How would they describe their sexual orientation? (optional)' },
      },
      'ethnic-group': {
        ethnicGroup: {
          question: `What is ${name}'s ethnic group?`,
          answers: {
            white: 'White',
            mixed: 'Mixed or multiple ethnic groups',
            asian: 'Asian or Asian British',
            black: 'Black, African, Caribbean or Black British',
            other: 'Other ethnic group',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
      'asian-background': {
        asianBackground: {
          question: `Which of the following best describes ${name}'s Asian or Asian British background?`,
          answers: {
            indian: 'Indian',
            pakistani: 'Pakistani',
            chinese: 'Chinese',
            bangladeshi: 'Bangladeshi',
            other: 'Any other Asian background',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalAsianBackground: { question: 'How would they describe their background? (optional)' },
      },
      'black-background': {
        blackBackground: {
          question: `Which of the following best describes ${name}'s Black, African, Caribbean or Black British background?`,
          answers: {
            african: 'African',
            caribbean: 'Caribbean',
            other: 'Any other Black, African or Caribbean background',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalBlackBackground: { question: 'How would they describe their background? (optional)' },
      },
      'white-background': {
        whiteBackground: {
          question: `Which of the following best describes ${name}'s White background?`,
          answers: {
            english: 'English, Welsh, Scottish, Northern Irish or British',
            irish: 'Irish',
            gypsy: 'Gypsy or Irish Traveller',
            other: 'Any other White background',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalWhiteBackground: { question: 'How would they describe their background? (optional)' },
      },
      'mixed-background': {
        mixedBackground: {
          question: `Which of the following best describes ${name}'s mixed or multiple ethnic groups background?`,
          answers: {
            whiteAndBlackCaribbean: 'White and Black Caribbean',
            whiteAndBlackAfrican: 'White and Black African',
            whiteAndAsian: 'White and Asian',
            other: 'Any other mixed or multiple ethnic background',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalMixedBackground: { question: 'How would they describe their background? (optional)' },
      },
      'other-background': {
        otherBackground: {
          question: `Which of the following best describes ${name}'s background?`,
          answers: {
            arab: 'Arab',
            other: 'Any other ethnic group',
            preferNotToSay: 'Prefer not to say',
          },
        },
        optionalOtherBackground: { question: 'How would they describe their background? (optional)' },
      },
      religion: {
        religion: {
          question: `What is ${name}'s religion?`,
          answers: {
            noReligion: 'No religion',
            atheist: 'Atheist or Humanist',
            agnostic: 'Agnostic',
            christian: 'Christian',
            buddhist: 'Buddhist',
            hindu: 'Hindu',
            jewish: 'Jewish',
            muslim: 'Muslim',
            sikh: 'Sikh',
            other: 'Any other religion',
            preferNotToSay: 'Prefer not to say',
          },
        },
        otherReligion: { question: 'What is their religion? (optional)' },
      },
      'military-veteran': {
        isVeteran: {
          question: `Is ${name} a military veteran?`,
          answers: yesNoOrIDontKnow,
        },
      },
      'care-leaver': {
        isCareLeaver: {
          question: `Is ${name} a care leaver?`,
          answers: yesNoOrIDontKnow,
        },
      },
      'parental-carer-responsibilities': {
        hasParentalOrCarerResponsibilities: {
          question: `Does ${name} have parental or carer responsibilities?`,
          answers: yesNoOrIDontKnow,
        },
      },
      'marital-status': {
        maritalStatus: {
          question: `What is ${name}'s legal marital or registered civil partnership status?`,
          answers: {
            neverMarried: 'Never married and never registered in a civil partnership',
            married: 'Married',
            inCivilPartnership: 'In a registered civil partnership',
            marriedButSeparated: 'Separated, but still legally married',
            inCivilPartnershipButSeparated: 'Separated, but still legally in a civil partnership',
            divorced: 'Divorced',
            formerlyInCivilPartnershipNowDissolved: 'Formerly in a civil partnership which is now legally dissolved',
            widowed: 'Widowed',
            survivingPartnerFromCivilPartnership: 'Surviving partner from a registered civil partnership',
            preferNotToSay: 'Prefer not to say',
          },
        },
      },
    },
    'area-information': {
      'first-preferred-area': {
        preferredArea: {
          question: 'First preferred area',
          hint: 'Specify a town, city or region',
        },
        preferenceReason: {
          question: 'Reason for first preference',
          hint: 'Include a reason why the applicant prefers this area',
        },
      },
      'second-preferred-area': {
        preferredArea: {
          question: 'Second preferred area',
          hint: 'Specify a town, city or region',
        },
        preferenceReason: {
          question: 'Reason for second preference',
          hint: 'Include a reason why the applicant prefers this area',
        },
      },
      'other-area-preferences': {
        preferenceInformation: {
          question: 'Enter any other preference information',
          hint: 'For example, the applicant is happy to be placed anywhere. Include a reason for any preferences.',
        },
      },
      'exclusion-zones': {
        hasExclusionZones: {
          question: `Are there any exclusion zones or areas where ${name} should not be placed?`,
          answers: yesOrNo,
        },
        exclusionZonesDetail: {
          question: 'Enter any safeguarding details',
        },
      },
      'gang-affiliations': {
        hasGangAffiliations: {
          question: `Does ${name} have any gang affiliations?`,
          answers: { ...yesNoOrIDontKnow, dontKnow: 'Not known' },
        },
        gangDetails: {
          question:
            'Enter details of the gang, including its names, the areas it operates in and the nature of their involvement',
        },
        gangNotKnownDetails: {
          question: 'Enter the reason why it is not known',
        },
        rivalGangsOrCountyLines: {
          question: 'Are there any rival gangs or county lines?',
          answers: { ...yesNoOrIDontKnow, dontKnow: 'Not known' },
        },
        rivalGangsOrCountyLinesDetail: {
          question: 'Enter the name and the area(s) they operate in (optional)',
        },
        rivalGangNotKnownDetail: {
          question: 'Enter the reason why it is not known',
        },
      },
      'family-accommodation': {
        familyProperty: {
          question: 'Do they want to apply to live with their children in a family property?',
          answers: yesOrNo,
        },
      },
    },
    'funding-information': {
      'funding-cas2-accommodation': {
        fundingSource: {
          question: `How will the applicant pay for their accommodation and the service charge?`,
          answers: {
            benefits: 'Housing Benefit',
            personalSavings: 'Personal savings, salary or pension',
          },
        },
        fundingSourceDetail: {
          question: 'Enter details (optional)',
        },
        hasNationalInsuranceNumber: {
          question: 'Does the applicant have a National Insurance number?',
          answers: {
            yes: 'Yes',
            no: 'No, they do not have one',
            dontKnow: "They have one but they don't know the number",
          },
        },
        nationalInsuranceNumber: {
          question: 'Enter the number (optional)',
          hint: 'For example, SF123456X',
        },
        receivingBenefits: {
          question: 'Is the applicant currently receiving benefits?',
          hint: 'For example, Universal Credit, Personal Independence Payments or Employment & Support Allowance',
          answers: yesOrNo,
        },
        receivedBenefitSanctions: {
          question: 'Have they received any benefit sanctions in the last 6 months?',
          answers: yesOrNo,
        },
      },
      'applicant-id': {
        idDocuments: {
          question: `What identity document (ID) does the applicant have?`,
          hint: 'Expired ID will be accepted. Select all that apply.',
          answers: {
            passport: 'Passport',
            travelPass: 'Travel pass with photograph',
            birthCertificate: 'Birth certificate',
            bankOrDebitCard: 'Bank account or debit card',
            bankStatements: 'Bank, building society or Post Office card account statements',
            drivingLicence: 'UK photo driving licence (full or provisional)',
            wageSlip: 'Recent wage slip (with payee name and NI number)',
            none: 'None of these options',
          },
        },
      },
      'alternative-applicant-id': {
        alternativeIDDocuments: {
          question: 'What other identification document (ID) does the applicant have?',
          hint: 'Expired ID will be accepted. Select all that apply.',
          answers: {
            contract: 'Employer letter/contract of employment',
            tradeUnion: 'Trade union membership card',
            invoice: 'Invoices (self-employed)',
            hmrc: 'HMRC correspondence',
            citizenCard: 'CitizenCard',
            foreignBirthCertificate: 'Foreign birth certificate',
            citizenCertificate: 'British citizen registration/naturalisation certificate',
            residenceCard: 'Permanent residence card',
            residencePermit: 'Residence permit',
            biometricResidencePermit: 'Biometric Residence Permit',
            laRentCard: 'Local authority rent card',
            marriageCertificate: 'Original marriage/civil partnership certificate',
            divorcePapers: 'Divorce or annulment papers',
            dissolutionPapers: 'Dissolution of marriage/civil partnership papers',
            buildingSociety: 'Building society passbook',
            councilTax: 'Council tax documents',
            insurance: 'Life assurance or insurance policies',
            chequeBook: 'Personal cheque book',
            mortgage: 'Mortgage repayment policies',
            savingAccount: 'Saving account book',
            studentID: 'Student ID card',
            educationalInstitution: 'Educational institution letter (student)',
            youngScot: 'Young Scot card',
            deedPoll: 'Deed poll certificate',
            vehicleRegistration: 'Vehicle registration/motor insurance documents',
            nhsCard: 'NHS medical card',
            other: 'Other type of identification',
            none: 'No ID available',
          },
        },
        other: { question: `What other ID does ${name} have?` },
      },
    },
    'health-needs': {
      'substance-misuse': {
        substanceAndAlcoholUse: {
          question: 'Do they have any issues related to substance and alcohol use?',
          answers: yesOrNo,
        },
        substanceAndAlcoholUseDetail: {
          question:
            'Enter details about the substances they use, including when, the method used, the amount taken and if they have a formal diagnosis',
          hint: 'This can include any issues in the past and present.',
        },
        requiresSubstituteMedication: {
          question: 'Do they require any substitute medication for used substances?',
          answers: yesOrNo,
        },
        substituteMedicationDetail: { question: 'What substitute medication do they take?' },
        engagedWithDrugAndAlcoholService: {
          question: 'Are they engaged with a drug and alcohol service?',
          hint: 'This refers to any services they are currently engaged with either in custody or the community.',
          answers: {
            yes: 'Yes',
            awaitingAssessment: 'They are awaiting assessment with a drug and alcohol service',
            no: 'No',
          },
        },
        serviceDetails: {
          question: 'Enter the drug and alcohol service',
        },
        intentToReferToService: {
          question: 'Is there an intention to refer them to a drug and alcohol service?',
          hint: 'This refers to when they would be released into the community.',
          answers: { yes: 'Yes', no: 'No', notInPrisonCustody: 'No, the applicant is not in prison custody' },
        },
        releasedWithNaloxone: {
          question: 'Are they being released with naloxone?',
          answers: { yes: 'Yes', no: 'No', notInPrisonCustody: 'No, the applicant is not in prison custody' },
        },
      },
      'physical-health': {
        hasPhyHealthNeeds: {
          question: 'Do they have any physical and mobility needs?',
          hint: 'This includes needing a mobility scooter, stair lift, wet room, grip rails in the shower or bath, or wider door frames and ramps. This list is not exhaustive.',
          answers: yesOrNo,
        },
        needsDetail: { question: 'Enter details of their needs, including if they have a formal diagnosis' },
        requiresSupport: {
          question: 'Do they need any support as a result of this?',
          answers: yesOrNo,
        },
        supportDetail: {
          question:
            'Enter details of the type of support, including if they are receiving any treatment and medication',
        },
        canClimbStairs: {
          question: 'Can they climb stairs?',
          answers: yesOrNo,
        },
        canLiveIndependently: { question: 'Can they live independently?', answers: yesOrNo },
        indyLivingDetail: { question: 'Describe why they are unable to live independently' },
      },
      'mental-health': {
        hasMentalHealthNeeds: { question: 'Do they have any mental health needs?', answers: yesOrNo },
        needsDetail: { question: 'Enter details of their needs, including if they have a formal diagnosis' },
        hasSupportNeeds: { question: 'Do they need any support as a result of this?', answers: yesOrNo },
        supportNeedsDetail: {
          question: 'Enter details of the type of support, including any support they have already or will need',
        },
        receivesTreatment: { question: 'Do they receive any treatment for this?', answers: yesOrNo },
        treatmentDetail: {
          question: 'Enter details about their treatment',
          hint: 'Include if they have their medication and if they can manage it in the community.',
        },
        isEngagedWithService: {
          question: 'Are they engaged with a mental health service?',
          hint: 'This includes mental health services in custody or the community.',
          answers: {
            yes: 'Yes',
            no: 'No',
            awaitingAssessment: 'They are awaiting assessment with a mental health service',
          },
        },
        serviceDetail: { question: 'Enter details about the mental health service' },
        willReferralBeMade: {
          question: 'Will a referral be made for support in the community when they are released?',
          answers: { yes: 'Yes', no: 'No', notInPrisonCustody: 'No, the applicant is not in prison custody' },
        },
        needsPresentation: {
          question: 'How are they currently presenting? (optional)',
          hint: 'For example, how they appeared when you last spoke to them.',
        },
      },
      'communication-and-language-relevance-check': {
        hasCommunicationAndLanguageNeeds: {
          question: `Does ${name} have any communication and language needs?`,
          answers: yesOrNo,
        },
      },
      'communication-and-language': {
        hasImpairments: {
          question: 'Do they have any literacy, visual or hearing impairments?',
          answers: yesOrNo,
        },
        impairmentsDetail: {
          question: 'Enter details of their needs, including any support they have already or will need',
        },
        requiresInterpreter: { question: 'Do they need an interpreter?', answers: yesOrNo },
        interpretationDetail: { question: 'What language do they need an interpreter for?' },
      },
      'learning-difficulties': {
        hasLearningDifficultiesOrNeurodiversityNeeds: {
          question: `Does ${name} have any learning difficulties or neurodiversity needs?`,
          answers: yesOrNo,
        },
      },
      'learning-difficulties-details': {
        learningNeedsDetail: {
          question: 'Enter details of their needs',
          hint: 'Include if they have a formal diagnosis.',
        },
        needsSupport: {
          question: 'Do they need any support as a result of this?',
          answers: yesOrNo,
        },
        supportDetail: {
          question: 'Enter details of the type of support needed, including any support they have already or will need',
        },
        receivesTreatment: { question: 'Do they receive any treatment for this?', answers: yesOrNo },
        treatmentDetail: {
          question: 'Enter details about their treatment',
          hint: 'Include if they have their medication and if they can manage it in the community.',
        },
        isVulnerable: { question: 'Are they vulnerable as a result of this?', answers: yesOrNo },
        vulnerabilityDetail: { question: 'Enter details of how they might be vulnerable' },
      },
      'brain-injury': {
        hasBrainInjury: {
          question: `Does ${name} have a brain injury?`,
          hint: 'This could be as a result of an accident, drug and alcohol use or an inherited or pre-existing condition.',
          answers: yesOrNo,
        },
      },
      'brain-injury-details': {
        injuryDetail: {
          question: 'Enter details of their brain injury',
          hint: 'Include if they have a formal diagnosis.',
        },
        supportNeeded: { question: 'Do they need any support as a result of this?', answers: yesOrNo },
        supportDetail: {
          question: 'Enter details of the type of support needed, including any support they have already or will need',
        },
        receivingTreatment: { question: 'Do they receive any treatment for this?', answers: yesOrNo },
        treatmentDetail: {
          question: 'Enter details about their treatment',
          hint: 'Include if they have their medication and if they can manage it in the community.',
        },
        isVulnerable: {
          question: 'Are they vulnerable as a result of this?',
          answers: yesOrNo,
        },
        vulnerabilityDetail: { question: 'Enter details of how they might be vulnerable' },
        hasDifficultyInteracting: {
          question: 'Do they have difficulties interacting with other people as a result of their injury?',
          answers: yesOrNo,
        },
        interactionDetail: { question: 'Enter details of the type of difficulties they have' },
      },
      'liaison-and-diversion': {
        liaisonAndDiversionAssessment: {
          question: `Has a Liaison and Diversion Assessment been carried out for ${name}?`,
          hint: 'This may have been carried out by the police or in court if the applicant has any mental health issues, learning disabilities, substance misuse problems, or other vulnerabilities.',
          answers: yesNoOrIDontKnow,
        },
      },
      'other-health': {
        hasLongTermHealthCondition: {
          question: 'Are they managing any long term health conditions?',
          hint: 'For example arthritis, diabetes or high blood pressure.',
          answers: yesOrNo,
        },
        healthConditionDetail: {
          question:
            'Enter details of their condition, including any support they have already or will need and if they have a formal diagnosis',
        },
        hasHadStroke: { question: 'Have they experienced a stroke?', answers: yesOrNo },
        hasSeizures: { question: 'Do they experience seizures or epilepsy?', answers: yesOrNo },
        seizuresDetail: {
          question: 'Enter details of their last episode, how frequent they are and any treatment',
        },
        beingTreatedForCancer: {
          question: 'Are they currently receiving regular treatment for cancer?',
          answers: yesOrNo,
        },
        otherHealthNeeds: {
          question: 'Do they have any other health needs?',
          hint: 'For example, any nut allergies or the need to have a private bathroom.',
          answers: yesOrNo,
        },
        otherHealthNeedsDetail: {
          question: 'Enter details of their other health needs',
        },
      },
      'information-sources': {
        informationSources: {
          question: "Where did you get the information on the applicant's health needs from?",
          answers: {
            interview: 'In person interview with applicant',
            nomis: 'NOMIS (National Offender Management Information System)',
            healthcare: 'Healthcare teams',
            casework: 'Case work',
            ndelius: 'NDelius (National probation database)',
            police: 'Police and Safeguarding teams',
            previousOasys: 'Previous OASys',
            currentOasys: 'Current OASys',
            other: 'Other',
          },
        },
        previousOasysDate: {
          question: 'Enter date of previous OASys',
        },
        otherSourcesDetail: {
          question: 'Enter other sources (optional)',
        },
      },
    },
    'risk-information': {
      concerns: {},
      'self-harm': {
        pastHarm: {
          question: 'Has the applicant self-harmed or attempted suicide in the past?',
          hint: 'This includes any incidents prior to being held in custody.',
          answers: yesOrNo,
        },
        pastHarmDetail: {
          question: 'Enter details including frequency and severity of self harm or suicide attempts and methods used',
        },
        currentConcerns: {
          question: 'Based on the information you have, are there any current concerns of self-harm or suicide?',
          hint: 'This includes any concerns whilst being held in custody.',
          answers: yesOrNo,
        },
        currentConcernsDetail: {
          question: 'Enter the details of any current concerns',
        },
        specificTriggers: {
          question: 'Does the applicant have any specific triggers related to self-harm or suicide?',
          answers: yesNoOrIDontKnow,
        },
        specificTriggersDetail: {
          question: 'Enter details about situations, topics or other triggers that might cause concern',
        },
        specificTriggersNotKnownDetail: {
          question: 'Enter reason why it is not known',
        },
        currentlyPresenting: {
          question: 'How are they currently presenting? (optional)',
          hint: 'For example, how they appeared when you last spoke to them.',
        },
      },
      'violence-and-arson': {
        pastConvictions: {
          question:
            'Has the applicant had any convictions or behaviours noted related to violence or arson in the past?',
          hint: 'This includes any incidents prior to being held in custody.',
          answers: yesOrNo,
        },
        pastConvictionsDetail: {
          question:
            'Enter details of any incidents, including any known victims, their location and relationship to the applicant',
        },
        currentConcerns: {
          question: 'Based on the information you have, are there any current concerns around violence or arson?',
          hint: 'This includes any concerns whilst being held in custody.',
          answers: yesOrNo,
        },
        currentConcernsDetail: {
          question: 'Enter the details of any current concerns',
        },
      },
      'safety-of-staff': {
        pastRiskToStaff: {
          question: `Has ${name} posed a risk to the safety of any staff in the past?`,
          hint: 'This includes any incidents prior to being held in custody.',
          answers: yesOrNo,
        },
        pastRiskToStaffDetail: {
          question: 'Enter details including a summary of the incidents, when they happened and any outcomes',
        },
        currentConcerns: {
          question: 'Based on the information you have, are there any current concerns over the safety of any staff?',
          hint: 'This includes any concerns over the safety of lone working female staff.',
          answers: yesOrNo,
        },
        currentConcernsDetail: {
          question: 'Enter the details of any current concerns',
        },
      },
      'living-in-the-community': {
        convictionsRelatedToHateOrAggression: {
          question:
            'Has the applicant had any convictions or behaviours noted related to aggression or hate towards others in the past?',
          hint: 'This includes any incidents prior to being held in custody.',
          answers: yesOrNo,
        },
        convictionsDetail: {
          question:
            'Enter details, including if they have a history of bullying, intimidation or controlling behaviour',
          hint: 'This includes any discrimination or abuse based on identity. For example, ethnicity, religion or sexuality.',
        },
        victimOfOthers: {
          question: 'Has the applicant ever been a victim of violence, bullying, or intimidation from others?',
          answers: yesOrNo,
        },
        victimOfOthersDetail: {
          question: 'Enter details, including any vulnerabilities that might make them a target for harm',
        },
        otherConcerns: {
          question:
            'Based on the information you have, are there any other concerns with the applicant living in the community?',
          hint: 'This includes any concerns whilst being held in custody.',
          answers: yesOrNo,
        },
        otherConcernsDetail: {
          question: 'Enter the details of any current concerns',
        },
        cellSharingRiskAssessment: {
          question: 'Has a Cell Sharing Risk Assessment (CSRA) been done?',
          answers: { yes: 'Yes', no: 'No', notInPrisonCustody: 'No, the applicant is not in prison custody' },
        },
        cellSharingRiskAssessmentDetail: {
          question: 'Enter any concerns around the applicant sharing communal areas with other residents',
        },
      },
      'risks-to-staff': {},
      'additional-concerns': {
        additionalConcerns: {
          question: `Are there any additional past or present concerns related to ${name}?`,
          answers: yesOrNo,
        },
        additionalConcernsDetail: {
          question: 'Enter the details of any additional concerns',
        },
      },
      'risk-management-arrangements': {
        arrangements: {
          question: `Are there any multi-agency risk management arrangements for ${name}?`,
          answers: {
            mappa: 'Multi-Agency Public Protection Arrangements (MAPPA)',
            marac: 'Multi-Agency Risk Assessment Conference (MARAC)',
            iom: 'Integrated Offender Management (IOM)',
            no: 'No, they do not have risk management arrangements',
          },
        },
        mappaDetails: {
          question: 'Enter MAPPA details',
          hint: 'Include lead contact details where possible.',
        },
        maracDetails: {
          question: 'Enter MARAC details',
          hint: 'Include lead contact details where possible.',
        },
        iomDetails: {
          question: 'Enter IOM details',
          hint: 'Include lead contact details where possible.',
        },
      },
      'does-the-applicant-have-acct-notes': {
        applicantHasAcctNotes: {
          question: 'Does the applicant have any ACCT notes?',
          answers: {
            ...yesOrNo,
            notInPrisonCustody: 'No, the applicant is not in prison custody',
          },
        },
      },
      'add-acct-note': {
        createdDate: {
          question: 'When was the ACCT created?',
          hint: 'For example, 31 3 1980',
        },
        isOngoing: {
          question: 'Is the ACCT ongoing?',
        },
        closedDate: {
          question: 'When was the ACCT closed?',
          hint: 'For example, 31 3 1980',
        },
        referringInstitution: {
          question: 'What was the referring institution?',
        },
        acctDetail: {
          question: 'Enter details about the ACCT',
        },
      },
      'domestic-abuse-concerns': {
        areConcerns: {
          question: 'Are there any past or present concerns related to domestic abuse for the applicant?',
          answers: yesOrNo,
        },
      },
      'details-of-domestic-abuse-concerns': {
        victimDetails: {
          question: 'Enter details of any known victims',
        },
        safeguarding: {
          question: 'Are there any safeguarding measures or professional teams involved that relate to domestic abuse?',
          answers: yesOrNo,
        },
        safeguardingDetail: {
          question: 'Enter any safeguarding details',
        },
      },
      'information-sources': {
        informationSources: {
          question: 'Where did you get the information on concerns about the applicant from?',
          answers: {
            interview: 'In person interview with applicant',
            nomis: 'NOMIS (National Offender Management Information System)',
            healthcare: 'Healthcare teams',
            casework: 'Case work',
            ndelius: 'NDelius (National probation database)',
            police: 'Police and Safeguarding teams',
            previousOasys: 'Previous OASys',
            currentOasys: 'Current OASys',
            other: 'Other',
          },
        },
        previousOasysDate: {
          question: 'Enter date of previous OASys',
        },
        otherSourcesDetail: {
          question: 'Enter other sources (optional)',
        },
      },
    },
    'add-probation-supervision-details': {
      'supervised-by-probation': {
        probationSupervision: {
          question: `Is ${name} currently supervised by probation?`,
          hint: 'This includes if they are currently serving a community order or other non-custodial sentence.',
          answers: yesOrNo,
        },
      },
      'community-probation-practitioner-details': {
        cppDetails: {
          question: `Who is ${name}'s Community Probation Practitioner (CPP)?`,
        },
      },
      'contacted-cpp-about-current-risk-levels': {
        hasContactedCppAboutCurrentRiskLevels: {
          question: `Have you contacted the CPP about ${name}'s current risk levels?`,
          answers: yesOrNo,
        },
        contactDate: {
          hint: 'For example, 24 5 2024',
          question: 'When did you contact them?',
        },
      },
      'you-must-contact-the-cpp': {},
      'serious-harm-risk-levels': {
        riskToChildren: {
          question: 'What is their level of risk to children?',
          answers: riskLevelAnswers,
        },
        riskToPublic: {
          question: 'What is their level of risk to the public?',
          answers: riskLevelAnswers,
        },
        riskToKnownAdults: {
          question: 'What is their level of risk to known adults?',
          answers: riskLevelAnswers,
        },
        riskToStaff: {
          question: 'What is their level of risk to staff?',
          answers: riskLevelAnswers,
        },
        overallRiskLevel: {
          question: 'What is their overall risk level?',
          answers: riskLevelAnswers,
        },
      },
    },
    'provide-offences-and-convictions-details': {
      'offences-and-convictions-guidance': {
        question: `${name}'s current alleged offences and previous convictions`,
      },
    },
    'alleged-offences': {
      'alleged-offence-data': {
        offenceName: {
          question: 'Current alleged offence name',
          hint: 'For example, Theft',
        },
        offenceDate: {
          question: 'When did the alleged offence take place?',
          hint: `For example, ${dateExample}`,
        },
      },
      'alleged-offences-summary': {
        summary: {
          question: `Add a summary of ${name}'s current alleged offences`,
        },
      },
    },
    'previous-unspent-convictions': {
      'any-previous-convictions': {
        hasAnyPreviousConvictions: {
          question: `Does ${name} have any previous unspent convictions?`,
          answers: {
            yesRelevantRisk: 'Yes and they are unspent and relevant to living in shared accommodation',
            yesNoRelevantRisk: 'Yes, but they do not meet the criteria listed',
            no: 'No, they do not have any previous unspent convictions',
          },
        },
      },
      'unspent-convictions-data': {
        convictionType: {
          ...offenceCategory,
          question: 'Select the conviction type',
          hint: 'For example, Arson or Drugs',
        },
        numberOfConvictions: {
          question: 'Number of convictions of this type',
          hint: 'For example, 3',
        },
        currentlyServing: {
          question: 'Are they currently serving a sentence for any of these convictions?',
          answers: {
            yes: 'Yes',
            no: 'No, they have served their sentence',
          },
        },
        convictionDetails: {
          question: 'What were the convictions and when did they happen?',
          hint: 'For example, Actual Bodily Harm on 20 9 2023.',
        },
        areOtherDetails: {
          question: 'Are there any other details about these convictions to add?',
          hint: 'For example, if there is an active restraining order or a child protection arrangement in place.',
          answers: {
            yes: 'Yes',
            no: 'No, there are no other details available',
          },
        },
        otherDetails: {
          question: 'Enter the details',
        },
      },
    },
    'bail-conditions': {
      'non-standard-bail-conditions': {
        nonStandardBailConditions: {
          question: `Are there any non-standard bail conditions being considered?`,
          hint: 'These can include any restrictions such as curfews or limitations on contact with specific individuals.',
          answers: {
            ...yesNoOrIDontKnow,
            dontKnow: 'I do not know',
          },
        },
        nonStandardBailConditionsDetail: {
          question: 'Enter details of any non-standard conditions being considered',
        },
      },
    },
    'bail-hearing-information': {
      'bail-hearing-information': {
        isBailHearingDateKnown: {
          question: `Do you know when the applicant's bail hearing is?`,
          answers: yesOrNo,
        },
        bailHearingDate: {
          question: 'When is the bail hearing?',
          hint: `For example, ${dateExample}`,
        },
        courtName: {
          question: `What's the name of the court where their bail hearing will take place? (optional)`,
          hint: `For example, Manchester Crown Court`,
        },
        bailHearingMedium: {
          question: `How will their bail hearing be heard? (optional)`,
          answers: {
            inCourt: 'In court',
            videoLink: 'Remotely via video conference',
            judgeInChambers: 'Judge in chambers',
          },
        },
      },
    },
  }
}
