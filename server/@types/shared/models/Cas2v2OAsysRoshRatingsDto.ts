/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cas2v2OASysAssessmentMetadataDto } from './Cas2v2OASysAssessmentMetadataDto';
import type { Cas2V2OASysRiskLevel } from './Cas2V2OASysRiskLevel';
export type Cas2v2OAsysRoshRatingsDto = {
    metadata: Cas2v2OASysAssessmentMetadataDto;
    overallRisk?: Cas2V2OASysRiskLevel;
    riskToChildren?: Cas2V2OASysRiskLevel;
    riskToKnownAdult?: Cas2V2OASysRiskLevel;
    riskToPublic?: Cas2V2OASysRiskLevel;
    riskToStaff?: Cas2V2OASysRiskLevel;
};

