import { InputLabel, MenuItem, Select, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { z } from 'zod';

import { JiraSourceType, type MuiSelectChangeHandler } from '@/types';
import { useTRPC } from '@/util/trpcFrontend';

export const DataSourceSettings = memo(function DataSourceSettings() {
    const trpc = useTRPC();
    const settingsQuery = useQuery(trpc.settings.get.queryOptions());
    const settingsMutation = useMutation(
        trpc.settings.set.mutationOptions({
            onSuccess: () => {
                settingsQuery.refetch().catch(() => {});
            },
        }),
    );
    const jiraConnectionDataQuery = useQuery(
        trpc.jiraConnection.getConnectionData.queryOptions(undefined, { enabled: settingsQuery.data?.jiraConnected }),
    );

    const handleJiraCloudIdChange = useCallback<MuiSelectChangeHandler<string | null>>(
        (event) => {
            const newValueParseResult = z.string().min(1).safeParse(event.target.value);
            if (!newValueParseResult.success) {
                return;
            }
            settingsMutation.mutate({
                jiraCloudId: newValueParseResult.data,
            });
        },
        [settingsMutation],
    );

    const handleJiraSourceTypeChange = useCallback<MuiSelectChangeHandler<JiraSourceType>>(
        (event) => {
            const newValueParseResult = JiraSourceType.safeParse(event.target.value);
            if (!newValueParseResult.success) {
                return;
            }
            settingsMutation.mutate({
                jiraSourceType: newValueParseResult.data,
            });
        },
        [settingsMutation],
    );

    return (
        <Stack margin={2} spacing={1}>
            <Typography variant="h6">Data Source</Typography>
            <Stack direction="row" spacing={4} useFlexGap flexWrap="wrap" justifyContent="space-between">
                <Box minWidth={120}>
                    <InputLabel id="jira-site">Jira Site</InputLabel>
                    <Select<string | null>
                        labelId="jira-site"
                        value={settingsQuery.data?.jiraCloudId ?? 'hi'}
                        label="Jira Site"
                        onChange={handleJiraCloudIdChange}
                        disabled={
                            settingsMutation.isPending ||
                            jiraConnectionDataQuery.isLoading ||
                            settingsQuery.isLoading ||
                            !settingsQuery.data?.jiraConnected
                        }
                    >
                        <MenuItem value={'hi'} disabled>
                            Select a site...
                        </MenuItem>
                        {jiraConnectionDataQuery.data !== undefined ? (
                            jiraConnectionDataQuery.data.sites.map((site) => (
                                <MenuItem key={site.id} value={site.id}>
                                    {site.name} ({site.url})
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Loading...</MenuItem>
                        )}
                    </Select>
                </Box>
                <Box>
                    <InputLabel id="jira-source-type">Jira Work Item Source</InputLabel>
                    <Select<JiraSourceType>
                        labelId="jira-source-type"
                        value={settingsQuery.data?.jiraSourceType ?? 'filter'}
                        label="Work Item Source"
                        onChange={handleJiraSourceTypeChange}
                        disabled={
                            settingsMutation.isPending || settingsQuery.isLoading || !settingsQuery.data?.jiraConnected
                        }
                    >
                        <MenuItem value="filter">Saved Filter</MenuItem>
                        <MenuItem value="board">Software Board</MenuItem>
                        <MenuItem value="jql">JQL</MenuItem>
                    </Select>
                </Box>
                <Box>TODO: Add more data source settings here</Box>
            </Stack>
        </Stack>
    );
});
