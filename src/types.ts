import type { SelectProps } from '@mui/material';
import { z } from 'zod';

export const JiraSourceType = z.literal('filter').or(z.literal('board')).or(z.literal('jql'));
export type JiraSourceType = z.infer<typeof JiraSourceType>;

export type SanitizedTrmnlConnection = {
    timeZoneIana: string | null;
    locale: string | null;
    jiraConnected: boolean;
    jiraCloudId: string | null;
    jiraSourceType: JiraSourceType;
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

export type MuiSelectChangeHandler<T> = Exclude<SelectProps<T>['onChange'], undefined>;
