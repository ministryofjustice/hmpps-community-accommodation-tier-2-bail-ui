/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cas2OASysAssessmentMetadataDto } from './Cas2OASysAssessmentMetadataDto';
import type { Cas2OASysRiskLevel } from './Cas2OASysRiskLevel';
export type Cas2OAsysRoshRatingsDto = {
    metadata: Cas2OASysAssessmentMetadataDto;
    overallRisk?: Cas2OASysRiskLevel;
    riskToChildren?: Cas2OASysRiskLevel;
    riskToKnownAdult?: Cas2OASysRiskLevel;
    riskToPublic?: Cas2OASysRiskLevel;
    riskToStaff?: Cas2OASysRiskLevel;
};

