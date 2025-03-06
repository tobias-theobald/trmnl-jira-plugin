import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { memo, useEffect } from 'react';
import { z } from 'zod';

import { generateAtlassianStateCookieName } from '@/util/constants';

const ManageRoot = dynamic(() => import('@/components/manage/Layout'), { ssr: false });

export type ManagePageProps = {
    ok: boolean;
    data: string;
    uuid: string;
};

export const getServerSideProps = (async ({ query, res }) => {
    // avoid triggering any build-time checks when bundling the frontend
    const { createJwt } = await import('@/services/jwt');
    const { uuid: uuidUnparsed } = query;
    const uuidParseResult = z.string().uuid().safeParse(uuidUnparsed);
    if (!uuidParseResult.success) {
        return { props: { ok: false, data: 'No UUID parameter found on request', uuid: '' } };
    }
    const uuid = uuidParseResult.data;
    // TODO check database if the UUID is known
    const cookieJwt = await createJwt(uuid, 'atlassian-cookie');
    res.appendHeader(
        'Set-Cookie',
        `${generateAtlassianStateCookieName(uuid)}=${cookieJwt}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`,
    );
    const manageJwt = await createJwt(uuid, 'manage');
    return { props: { ok: true, data: manageJwt, uuid } };
}) satisfies GetServerSideProps<ManagePageProps>;

export default memo(function ManagePage(props: ManagePageProps) {
    // hide the uuid in the address bar once the page hits the browser
    useEffect(() => {
        if (window?.history?.replaceState === undefined) {
            return;
        }
        const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
    }, []);

    if (!props.ok) {
        return (
            <>
                <h1>An error occurred</h1>
                <p>{props.data}</p>
                <p>Please go to the TRMNL plugin page and open this manage page again</p>
            </>
        );
    }

    return <ManageRoot jwt={props.data} uuid={props.uuid} />;
});
