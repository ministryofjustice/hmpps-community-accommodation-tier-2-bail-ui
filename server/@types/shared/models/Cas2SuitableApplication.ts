/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cas2CohortDto } from './Cas2CohortDto';
import type { Cas2ExternalSubmittedApplicationDto } from './Cas2ExternalSubmittedApplicationDto';
import type { Cas2StaffDto } from './Cas2StaffDto';
export type Cas2SuitableApplication = {
    cohort?: Cas2CohortDto;
    createdAt: string;
    createdBy: Cas2StaffDto;
    id: string;
    submittedApplication?: Cas2ExternalSubmittedApplicationDto;
    uiUrl: string;
};

