/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { Cas2v2Assessment } from './Cas2v2Assessment';
import type { Cas2v2User } from './Cas2v2User';
import type { FullPerson } from './FullPerson';
import type { RestrictedPerson } from './RestrictedPerson';
import type { UnknownPerson } from './UnknownPerson';
export type Cas2v2SubmittedApplication = {
    applicationOrigin?: ApplicationOrigin;
    assessment: Cas2v2Assessment;
    bailHearingDate?: string;
    createdAt: string;
    document?: any;
    id: string;
    person: (FullPerson | RestrictedPerson | UnknownPerson);
    submittedAt?: string;
    submittedBy?: Cas2v2User;
    telephoneNumber?: string;
    timelineEvents: Array<Cas2TimelineEvent>;
};

