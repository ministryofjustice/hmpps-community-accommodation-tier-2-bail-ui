/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cas2ExternalApplicationDto } from './Cas2ExternalApplicationDto';
import type { Cas2ExternalSubmittedApplicationDto } from './Cas2ExternalSubmittedApplicationDto';
export type Cas2SuitableApplication = {
    /**
     * Use submittedApplication instead
     * @deprecated
     */
    application?: Cas2ExternalApplicationDto;
    id: string;
    submittedApplication?: Cas2ExternalSubmittedApplicationDto;
    uiUrl: string;
};

