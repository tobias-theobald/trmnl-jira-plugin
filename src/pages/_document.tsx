import {
    documentGetInitialProps,
    DocumentHeadTags,
    type DocumentHeadTagsProps,
} from '@mui/material-nextjs/v15-pagesRouter';
import { type DocumentContext, type DocumentProps, Head, Html, Main, NextScript } from 'next/document';

import theme, { roboto } from '../theme';

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
    return (
        <Html lang="en" className={roboto.className}>
            <Head>
                {/* PWA primary color */}
                <meta name="theme-color" content={theme.palette.primary.main} />
                {/*<link rel="shortcut icon" href="/favicon.ico" />*/}
                <meta name="emotion-insertion-point" content="" />
                <DocumentHeadTags {...props} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    return await documentGetInitialProps(ctx);
};
