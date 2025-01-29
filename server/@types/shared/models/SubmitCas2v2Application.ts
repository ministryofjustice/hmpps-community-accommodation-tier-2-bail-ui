/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { Unit } from './Unit';
export type SubmitCas2v2Application = {
    translatedDocument: Unit;
    /**
     * Id of the application being submitted
     */
    applicationId: string;
    /**
     * First and second preferences for where the accommodation should be located, pipe-separated
     */
    preferredAreas?: string;
    hdcEligibilityDate?: string;
    conditionalReleaseDate?: string;
    telephoneNumber: string;
    applicationOrigin: ApplicationOrigin;
    bailHearingDate?: string;
};

