import type { PropsWithChildren } from 'react';

export const metadata = {
    title: 'TRMNL plugin for Jira',
    description: 'Show your Jira issues on your TRMNL device',
};

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
