/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationOrigin } from './ApplicationOrigin';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { Cas2v2Assessment } from './Cas2v2Assessment';
import type { Cas2v2User } from './Cas2v2User';
import type { Person } from './Person';
import type { Unit } from './Unit';
export type Cas2v2SubmittedApplication = {
    id: string;
    person: Person;
    createdAt: string;
    submittedBy?: Cas2v2User;
    schemaVersion: string;
    outdatedSchema: boolean;
    document?: Unit;
    submittedAt?: string;
    telephoneNumber?: string;
    applicationOrigin?: ApplicationOrigin;
    timelineEvents: Array<Cas2TimelineEvent>;
    assessment: Cas2v2Assessment;
    bailHearingDate?: string;
};

