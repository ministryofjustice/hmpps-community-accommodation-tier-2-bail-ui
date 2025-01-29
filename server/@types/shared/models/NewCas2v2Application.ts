/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
export type NewCas2v2Application = {
    crn: string;
    convictionId?: number;
    deliusEventNumber?: string;
    offenceId?: string;
    applicationOrigin: ApplicationOrigin;
    bailHearingDate?: string;
};

