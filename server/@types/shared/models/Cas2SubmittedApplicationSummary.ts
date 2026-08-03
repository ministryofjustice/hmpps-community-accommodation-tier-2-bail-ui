/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { Cas2CohortDto } from './Cas2CohortDto';
export type Cas2SubmittedApplicationSummary = {
    applicationOrigin?: ApplicationOrigin;
    bailHearingDate?: string;
    cohort?: Cas2CohortDto;
    createdAt: string;
    createdByUserId: string;
    crn: string;
    id: string;
    nomsNumber?: string;
    personName: string;
    submittedAt?: string;
};

