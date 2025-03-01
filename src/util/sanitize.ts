import type { TrmnlConnection } from '@/entity/TrmnlConnection';
import type { SanitizedTrmnlConnection } from '@/types';

export const sanitizeTrmnlConnectionForFrontend = (trmnlConnection: TrmnlConnection): SanitizedTrmnlConnection => {
    const {
        timeZoneIana,
        locale,
        jiraConnection,
        jiraCloudId,
        jiraSourceType,
        jiraJql,
        jiraFilterId,
        jiraBoardId,
        jiraOnlyIssuesAssignedToMe,
        jiraAdditionalFields,
        displayStyleFull,
        displayStyleWide,
        displayStyleTall,
        displayStyleQuadrant,
        boardColumnsByStatus,
    } = trmnlConnection;
    return {
        timeZoneIana,
        locale,
        jiraConnected: jiraConnection !== null,
        jiraCloudId,
        jiraSourceType,
        jiraJql,
        jiraFilterId,
        jiraBoardId,
        jiraOnlyIssuesAssignedToMe,
        jiraAdditionalFields,
        displayStyleFull,
        displayStyleWide,
        displayStyleTall,
        displayStyleQuadrant,
        boardColumnsByStatus,
    };
};
