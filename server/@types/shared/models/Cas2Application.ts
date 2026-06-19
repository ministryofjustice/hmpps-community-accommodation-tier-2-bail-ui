/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { ApplicationStatus } from './ApplicationStatus';
import type { Cas2Assessment } from './Cas2Assessment';
import type { Cas2CohortDto } from './Cas2CohortDto';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { Cas2User } from './Cas2User';
import type { FullPerson } from './FullPerson';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type Cas2Application = {
    applicationOrigin: ApplicationOrigin;
    assessment?: Cas2Assessment;
    bailHearingDate?: string;
    cohort?: Cas2CohortDto;
    createdAt: string;
    createdBy: Cas2User;
    data?: any;
    document?: any;
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    status: ApplicationStatus;
    submittedAt?: string;
    telephoneNumber?: string;
    timelineEvents?: Array<Cas2TimelineEvent>;
    type: string;
};

