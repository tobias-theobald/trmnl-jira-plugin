import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { memo, useEffect } from 'react';

const ManageRoot = dynamic(() => import('@/components/manage/ManageRoot'), { ssr: false });

export type ManagePageProps = {
    ok: boolean;
    data: string;
};

export const getServerSideProps = (async ({ query }) => {
    // avoid triggering any build-time checks when bundling the frontend
    const { createJwt } = await import('@/util/jwt');
    const { uuid } = query;
    if (typeof uuid !== 'string') {
        return { props: { ok: false, data: 'No UUID parameter found on request' } };
    }
    // TODO check database if the UUID is known
    return { props: { ok: true, data: await createJwt(uuid) } };
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

    return <ManageRoot jwt={props.data} />;
});
