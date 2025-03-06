'use client';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Card, IconButton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { DataSourceSettings } from '@/components/manage/DataSourceSettings';
import { JiraConnection } from '@/components/manage/JiraConnection';
import TrpcQueryClientProvider from '@/components/providers/TrpcQueryClientProvider';

export type ManageRootProps = {
    jwt: string;
    uuid: string;
};

const Layout = ({ jwt, uuid }: ManageRootProps) => {
    const reloadButtonHref = `/manage?uuid=${encodeURIComponent(uuid)}`;

    return (
        <TrpcQueryClientProvider jwt={jwt}>
            <Container maxWidth="lg">
                <Stack direction="row" marginY={4} spacing={1} justifyContent="space-between">
                    <Typography variant="h4" component="h1">
                        Configure Jira - TRMNL integration
                    </Typography>
                    <IconButton href={reloadButtonHref} aria-label="reload page">
                        <RefreshIcon />
                    </IconButton>
                </Stack>
                <Box marginY={4}>
                    <Card>
                        <JiraConnection />
                    </Card>
                </Box>
                <Box marginY={4}>
                    <Card>
                        <DataSourceSettings />
                    </Card>
                </Box>
            </Container>
        </TrpcQueryClientProvider>
    );
};

export default Layout;
