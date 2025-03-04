import LinkIcon from '@mui/icons-material/Link';
import { Avatar, Button, Card, CircularProgress, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { useTRPC } from '@/util/trpcFrontend';

const JiraConnectionLayout = ({ children }: PropsWithChildren) => {
    return <Card>{children}</Card>;
};

const JiraConnected = () => {
    const generateOauthUrlQuery = useQuery(useTRPC().jiraConnection.generateOauthUrl.queryOptions());

    // const disconnectJiraMutation = useTRPC().disconnectJira;
    return (
        <Stack direction="row" spacing={2}>
            <Avatar>TODO</Avatar>
            <Button
                loading={generateOauthUrlQuery.isLoading}
                href={generateOauthUrlQuery.data}
                variant="contained"
                startIcon={<LinkIcon />}
            >
                Connect a new Jira site
            </Button>
        </Stack>
    );
};
const JiraDisconnected = () => {
    const generateOauthUrlQuery = useQuery(useTRPC().jiraConnection.generateOauthUrl.queryOptions());
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Button
                loading={generateOauthUrlQuery.isLoading}
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
                <CircularProgress />
            </JiraConnectionLayout>
        );
    }

    if (settings.error) {
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
