'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { JiraConnection } from '@/components/manage/JiraConnection';
import TrpcQueryClientProvider from '@/components/providers/TrpcQueryClientProvider';

export type ManageRootProps = {
    jwt: string;
};

const Layout = ({ jwt }: ManageRootProps) => {
    return (
        <TrpcQueryClientProvider jwt={jwt}>
            <Container maxWidth="lg">
                <Box marginY={4}>
                    <Typography variant="h4" component="h1">
                        Configure Jira - TRMNL integration
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <JiraConnection />
                </Box>
            </Container>
        </TrpcQueryClientProvider>
    );
};

export default Layout;
