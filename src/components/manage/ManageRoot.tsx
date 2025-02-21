'use client';
import { Container, Typography } from '@mui/material';

import TrpcQueryClientProvider from '@/components/providers/TrpcQueryClientProvider';

export type ManageRootProps = {
    jwt: string;
};

const ManageRoot = ({ jwt }: ManageRootProps) => {
    return (
        <TrpcQueryClientProvider jwt={jwt}>
            <Container>
                <Typography variant="h4" component="h1">
                    Manage Page
                </Typography>
            </Container>
        </TrpcQueryClientProvider>
    );
};

export default ManageRoot;
