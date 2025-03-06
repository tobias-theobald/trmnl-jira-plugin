import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Avatar, Button, Card, CircularProgress, Skeleton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { type PropsWithChildren, useCallback } from 'react';

import { useTRPC } from '@/util/trpcFrontend';

const JiraConnectionLayout = ({ children }: PropsWithChildren) => {
    return (
        <Card>
            <Box margin={2}>{children}</Box>
        </Card>
    );
};

const JiraConnected = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const generateOauthUrlQuery = useQuery(trpc.jiraConnection.generateOauthUrl.queryOptions());
    const jiraConnectionDataQuery = useQuery(trpc.jiraConnection.getJiraConnectionData.queryOptions());
    const disconnectJiraMutation = useMutation(
        trpc.jiraConnection.disconnectJira.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries().catch(() => {});
            },
        }),
    );

    const doDisconnectJira = useCallback(() => {
        disconnectJiraMutation.mutate();
    }, [disconnectJiraMutation]);

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            useFlexGap
            flexWrap="wrap"
        >
            <Stack direction="row" spacing={1} alignItems="center">
                {jiraConnectionDataQuery.isLoading ? (
                    <Skeleton variant="circular" />
                ) : (
                    <Avatar
                        alt={jiraConnectionDataQuery.data?.profile.name}
                        src={jiraConnectionDataQuery.data?.profile.picture}
                    />
                )}
                <Stack direction="column">
                    {jiraConnectionDataQuery.isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <Typography variant="subtitle1">{jiraConnectionDataQuery.data?.profile.name}</Typography>
                    )}
                    {jiraConnectionDataQuery.isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <Typography variant="body2">{jiraConnectionDataQuery.data?.profile.email}</Typography>
                    )}
                </Stack>
            </Stack>
            <Stack>
                <Typography variant="body2">
                    Connection expires in{' '}
                    {formatDistanceToNow(
                        new Date(jiraConnectionDataQuery.data?.absoluteRefreshTokenExpiresAt ?? Date.now()),
                    )}
                </Typography>
                <Typography variant="body2">Reauthenticate before then</Typography>
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="stretch">
                <Button
                    loading={disconnectJiraMutation.isPending}
                    disabled={disconnectJiraMutation.isPending}
                    onClick={doDisconnectJira}
                    variant="outlined"
                    startIcon={<LinkOffIcon />}
                >
                    Disconnect Jira
                </Button>
                <Button
                    loading={generateOauthUrlQuery.isLoading}
                    disabled={generateOauthUrlQuery.isLoading}
                    href={generateOauthUrlQuery.data}
                    variant="outlined"
                    startIcon={<AddLinkIcon />}
                >
                    Connect a new Jira site / Reauthenticate
                </Button>
            </Stack>
        </Stack>
    );
};
const JiraDisconnected = () => {
    const generateOauthUrlQuery = useQuery(useTRPC().jiraConnection.generateOauthUrl.queryOptions());
    return (
        <Stack direction="row" spacing={2} justifyContent="center">
            <Button
                loading={generateOauthUrlQuery.isLoading}
                disabled={generateOauthUrlQuery.isLoading}
                href={generateOauthUrlQuery.data}
                variant="contained"
                startIcon={<LinkIcon />}
            >
                Connect to Jira
            </Button>
        </Stack>
    );
};

export const JiraConnection = () => {
    const settings = useQuery(useTRPC().getSettings.queryOptions());

    if (settings.isPending) {
        return (
            <JiraConnectionLayout>
                <Stack direction="row" justifyContent="center">
                    <CircularProgress />
                </Stack>
            </JiraConnectionLayout>
        );
    }

    if (settings.isError) {
        return (
            <JiraConnectionLayout>
                <div>Error loading settings: {JSON.stringify(settings.error)}</div>
            </JiraConnectionLayout>
        );
    }

    if (settings.data.jiraConnected) {
        return (
            <JiraConnectionLayout>
                <JiraConnected />
            </JiraConnectionLayout>
        );
    } else {
        return (
            <JiraConnectionLayout>
                <JiraDisconnected />
            </JiraConnectionLayout>
        );
    }
};
