import {NextRequest} from "next/server";
import docker_fetch from "@/lib/dockerd";

const POST = async (req: NextRequest, options: { params: {id: string} }) => {
    if (!process.env.PERMISSION_DELETE)
        return Response.json({error: 'Permission denied'}, {status: 401});

    return docker_fetch('/containers/' + options.params.id, {method: 'DELETE'});
}

export {POST};

export const dynamic = 'force-dynamic'