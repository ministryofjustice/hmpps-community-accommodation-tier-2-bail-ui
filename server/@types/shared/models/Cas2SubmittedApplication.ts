/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { Cas2Assessment } from './Cas2Assessment';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { Cas2User } from './Cas2User';
import type { FullPerson } from './FullPerson';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type Cas2SubmittedApplication = {
    applicationOrigin?: ApplicationOrigin;
    assessment: Cas2Assessment;
    bailHearingDate?: string;
    createdAt: string;
    document?: any;
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    submittedAt?: string;
    submittedBy?: Cas2User;
    telephoneNumber?: string;
    timelineEvents: Array<Cas2TimelineEvent>;
};

