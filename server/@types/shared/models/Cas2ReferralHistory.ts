/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceType } from './ServiceType';
export type Cas2ReferralHistory = {
    applicationId: string;
    applicationLastUpdatedDate?: string;
    applicationStatus?: string;
    applicationSubmittedDate: string;
    id: string;
    localAuthorityArea?: string;
    pdu?: string;
    placementAddress?: string;
    referralRejectionReason?: string;
    referredBy: string;
    type: ServiceType;
    uiUrl: string;
};

