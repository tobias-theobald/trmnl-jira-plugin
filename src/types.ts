export type SanitizedTrmnlConnection = {
    timeZoneIana: string | null;
    locale: string | null;
    jiraConnected: boolean;
    jiraCloudId: string | null;
    jiraSourceType: 'filter' | 'board' | 'jql';
    jiraJql: string | null;
    jiraFilterId: string | null;
    jiraBoardId: string | null;
    jiraOnlyIssuesAssignedToMe: boolean;
    jiraAdditionalFields: string[];
    displayStyleFull: 'list' | 'board';
    displayStyleWide: 'list' | 'board';
    displayStyleTall: 'list' | 'board';
    displayStyleQuadrant: 'list' | 'board';
    boardColumnsByStatus: string[];
};

export type JiraEntityNames = {
    atlassianAccount: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
    } | null;
    siteByCloudId: Record<string, string>;
    filterById: Record<string, string>;
    boardById: Record<string, string>;
    jiraIssueFieldsById: Record<string, string>;
    jiraStatusById: Record<string, string>;
};
