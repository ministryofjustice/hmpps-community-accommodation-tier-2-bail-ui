/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { Cas2CohortDto } from './Cas2CohortDto';
import type { Found } from './Found';
import type { LimitedAccess } from './LimitedAccess';
import type { NotFound } from './NotFound';
export type Cas2SubmittedApplicationSummary = {
    applicationOrigin?: ApplicationOrigin;
    bailHearingDate?: string;
    cohort?: Cas2CohortDto;
    createdAt: string;
    createdByUserId: string;
    crn: string;
    id: string;
    nomsNumber?: string;
    /**
     * Use personSummary instead
     * @deprecated
     */
    personName: string;
    personSummary: (Found | LimitedAccess | NotFound);
    submittedAt?: string;
};

