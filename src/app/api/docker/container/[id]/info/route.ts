import {NextRequest} from "next/server";
import docker_fetch from "@/lib/dockerd";
import {ContainerEnvs, ContainerInfo} from "@/types/ContainerData";

const GET = async (req: NextRequest, options: { params: {id: string} }) => {
    if (!process.env.PERMISSION_INFO)
        return Response.json({error: 'Permission denied'}, {status: 401});

    const raw = await docker_fetch('/containers/' + options.params.id + '/json');
    if (raw.status !== 200)
        return Response.error();
    const container = await raw.json();

    const info: ContainerInfo = {
        labels: container.Config.Labels
    }

    return Response.json(info);
}

export {GET};

export const dynamic = 'force-dynamic'