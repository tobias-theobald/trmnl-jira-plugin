import { validateUuidAndGenerateJwt } from '@/app/manage/actions';
import ManageRoot from '@/components/manage/ManageRoot';

const ManagePage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { uuid } = await searchParams;

    if (typeof uuid !== 'string') {
        return <div>Invalid UUID. Make sure to open this page from the TRMNL plugin management page</div>;
    }

    const jwt = await validateUuidAndGenerateJwt(uuid);

    if (!jwt) {
        return (
            <div>
                Unknown UUID. Make sure you finish installing this plugin in the TRMNL plugin management page before
                opening this page
            </div>
        );
    }

    return <ManageRoot jwt={jwt} />;
};

export default ManagePage;
