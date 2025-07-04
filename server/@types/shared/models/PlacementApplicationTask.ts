/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlacementApplicationDecision } from './PlacementApplicationDecision';
import type { PlacementDates } from './PlacementDates';
import type { PlacementType } from './PlacementType';
import type { ReleaseTypeOption } from './ReleaseTypeOption';
import type { RiskTierEnvelope } from './RiskTierEnvelope';
import type { Task } from './Task';
export type PlacementApplicationTask = (Task & {
    tier: RiskTierEnvelope;
    releaseType: ReleaseTypeOption;
    placementType: PlacementType;
    dates: PlacementDates;
    /**
     * Placement apps only have one set of placement dates, use 'dates' instead
     * @deprecated
     */
    placementDates?: Array<PlacementDates>;
    outcome?: PlacementApplicationDecision;
});

