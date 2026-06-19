/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { ApplicationStatus } from './ApplicationStatus';
import type { Cas2CohortDto } from './Cas2CohortDto';
import type { LatestCas2StatusUpdate } from './LatestCas2StatusUpdate';
export type Cas2ApplicationSummary = {
    applicationOrigin: ApplicationOrigin;
    bailHearingDate?: string;
    cohort?: Cas2CohortDto;
    createdAt: string;
    createdByUserId: string;
    createdByUserName?: string;
    crn: string;
    hdcEligibilityDate?: string;
    id: string;
    latestStatusUpdate?: LatestCas2StatusUpdate;
    nomsNumber?: string;
    personName: string;
    prisonCode?: string;
    status: ApplicationStatus;
    submittedAt?: string;
    type: string;
};

