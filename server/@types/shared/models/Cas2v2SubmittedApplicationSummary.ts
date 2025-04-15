/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
export type Cas2v2SubmittedApplicationSummary = {
    id: string;
    createdByUserId: string;
    crn: string;
    nomsNumber?: string;
    personName: string;
    createdAt: string;
    submittedAt?: string;
    applicationOrigin?: ApplicationOrigin;
    bailHearingDate?: string;
};

