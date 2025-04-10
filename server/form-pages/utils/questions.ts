/* eslint-disable import/prefer-default-export */

export const getQuestions = (name: string) => {
  const yesOrNo = { yes: 'Yes', no: 'No' }
  const yesNoOrIDontKnow = { yes: 'Yes', no: 'No', dontKnow: `I don't know` }

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

  const offenceSummaryHintHtml =
    '<div id="offence-details-hint" class="govuk-hint"> <p class="govuk-hint">Include:</p> <ul class="govuk-list govuk-list--bullet govuk-hint"> <li>what happened (excluding names and other sensitive information)</li> <li>where it happened (excluding addresses)</li><li>when it happened</li><li>damage or injury caused</li><li>weapon type</li><li>motivations for the offence</li><li>if a violent offence, the relationship to the victim</li></ul></div>'

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
        consentRefusalDetail: {
          question: 'Why was consent refused?',
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
      'support-worker-preference': {
        hasSupportWorkerPreference: {
          question: `Does ${name} have a gender preference for their support worker?`,
          answers: yesNoOrIDontKnow,
        },
        supportWorkerPreference: {
          question: 'What is their preference?',
          answers: { male: 'Male', female: 'Female' },
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
          question: `Did ${name} have an address before entering custody?`,
          answers: {
            yes: 'Yes',
            no: 'No fixed address',
          },
        },
        knownAddress: {
          question: 'What was the address?',
        },
        lastKnownAddress: {
          question: 'What was their last known address? (Optional)',
        },
        howLong: {
          question: 'How long did the applicant have no fixed address for?',
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
          answers: yesOrNo,
        },
        gangName: {
          question: 'What is the name of the gang?',
        },
        gangOperationArea: {
          question: 'Where do they operate?',
        },
        rivalGangDetail: {
          question: 'Name any known rival gangs and where they operate (optional)',
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
        hasLearningNeeds: {
          question: 'Do they have any needs relating to learning difficulties or neurodiversity?',
          answers: yesOrNo,
        },
        learningNeedsDetail: { question: 'Enter details of their needs, including if they have a formal diagnosis' },
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
          question: 'Do they have a brain injury?',
          answers: yesOrNo,
        },
        injuryDetail: {
          question: 'Enter details of their brain injury and needs, including if they have a formal diagnosis',
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
        interactionDetail: { question: 'Enter details of the type of difficulties they have.' },
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
          question:
            'Based on the information you have, has the applicant ever been a victim of violence, bullying, or intimidation from others?',
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
      'acct-data': {
        createdDate: {
          question: 'When was the ACCT created?',
          hint: 'For example, 22 4 2003',
        },
        isOngoing: {
          question: 'Is the ACCT ongoing?',
        },
        closedDate: {
          question: 'When was the ACCT closed?',
          hint: 'For example, 22 4 2003',
        },
        referringInstitution: {
          question: 'Referring institution',
          hint: 'Where the applicant was based at the time the ACCT was created',
        },
        acctDetail: {
          question: 'Details about the ACCT',
        },
      },
    },
    'community-supervision-and-current-offences': {
      'community-supervision': {
        probationSupervision: {
          question: `Is ${name} currently supervised by probation?`,
          answers: yesOrNo,
        },
      },
      'cpp-details': {
        cppDetails: {
          question: `Who is ${name}'s Community Probation Practitioner (CPP)?`,
          hint: 'A Community Probation Practitioner (CPP) is also known as Community Offender Manager (COM).',
        },
      },
      'current-offence-data': {
        titleAndNumber: {
          question: 'Offence title',
          hint: "For example, 'Stalking'",
        },
        offenceCategory,
        offenceDate: {
          question: 'When did they commit the offence?',
          hint: `For example, ${dateExample}`,
        },
        sentenceLength: {
          question: 'How long were they sentenced for?',
          hint: 'For example, 6 months',
        },
        summary: {
          question: 'Provide a summary of the offence',
          hint: offenceSummaryHintHtml,
        },
        outstandingCharges: {
          question: `Are there outstanding charges committed prior to the current sentence?`,
          answers: yesOrNo,
        },
        outstandingChargesDetail: {
          question: 'Details of any outstanding charges',
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
            yesRelevantRisk: 'Yes and it is from one of the relevant categories',
            yesNoRelevantRisk: 'Yes and it is not from one of the relevant categories',
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
        safeguarding: {
          question: 'Are there any safeguarding details to add about these convictions?',
          hint: 'For example, if there is an active restraining order or a child protection arrangement in place.',
          answers: {
            ...yesNoOrIDontKnow,
            dontKnow: 'Not known',
          },
        },
        safeguardingDetail: {
          question: 'Enter details of the safeguarding measures',
        },
      },
    },
    'bail-conditions-and-support-sessions': {
      'non-standard-bail-conditions': {
        nonStandardBailConditions: {
          question: `Are there any non-standard bail conditions being considered for ${name}?`,
          answers: yesOrNo,
        },
        nonStandardBailConditionsDetail: {
          question: 'What are they?',
        },
      },
      'mandatory-support-sessions': {
        mandatorySupportSessions: {
          question: `Does the court require more than one mandatory support session per week for ${name}?`,
          answers: yesOrNo,
        },
        mandatorySupportSessionsDetail: {
          question: 'Provide additional information on how many sessions are required',
        },
      },
    },
    'bail-hearing-information': {
      'bail-hearing-arranger': {
        bailHearingArranger: {
          question: 'Who will arrange the bail hearing?',
          answers: {
            solicitor: 'Solicitor',
            applicant: 'Applicant',
          },
        },
      },
      'court-name': {
        courtName: {
          question: `What's the name of the court where ${name}'s bail hearing will take place?`,
        },
      },
      'bail-hearing-date': {
        bailHearingDate: {
          question: `When is ${name}'s bail hearing?`,
          hint: `For example, ${dateExample}`,
        },
      },
      'bail-hearing-medium': {
        bailHearingMedium: {
          question: `How will ${name}'s bail hearing be heard?`,
          answers: {
            inCourt: 'In court',
            videoLink: 'Video link',
            judgeInChambers: 'Judge in Chambers',
          },
        },
      },
    },
  }
}
