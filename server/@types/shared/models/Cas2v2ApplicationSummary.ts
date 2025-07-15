/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { ApplicationStatus } from './ApplicationStatus';
import type { LatestCas2v2StatusUpdate } from './LatestCas2v2StatusUpdate';
import type { PersonRisks } from './PersonRisks';
export type Cas2v2ApplicationSummary = {
    createdAt: string;
    createdByUserId: string;
    createdByUserName?: string;
    crn: string;
    hdcEligibilityDate?: string;
    id: string;
    latestStatusUpdate?: LatestCas2v2StatusUpdate;
    nomsNumber?: string;
    prisonCode: string;
    applicationOrigin: ApplicationOrigin;
    bailHearingDate?: string;
    personName: string;
    risks?: PersonRisks;
    status: ApplicationStatus;
    submittedAt?: string;
    type: string;
};

