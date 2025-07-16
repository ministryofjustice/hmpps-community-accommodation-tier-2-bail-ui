/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
export type SubmitCas2v2Application = {
    /**
     * Id of the application being submitted
     */
    applicationId: string;
    applicationOrigin: ApplicationOrigin;
    bailHearingDate?: string;
    conditionalReleaseDate?: string;
    hdcEligibilityDate?: string;
    /**
     * First and second preferences for where the accommodation should be located, pipe-separated
     */
    preferredAreas?: string;
    telephoneNumber: string;
    /**
     * Any object
     */
    translatedDocument: any;
};

