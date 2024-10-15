import {NextRequest} from "next/server";
import docker_fetch from "@/lib/dockerd";
import {ContainerEnvs} from "@/types/ContainerData";

const GET = async (req: NextRequest, options: { params: { id: string } }) => {
    if (!process.env.PERMISSION_VOLUMES)
        return Response.json({error: 'Permission denied'}, {status: 401});

    const raw = await docker_fetch('/containers/' + options.params.id + '/json');
    if (raw.status !== 200)
        return Response.error();
    const container = await raw.json();

    return Response.json(container.Mounts.map((mount: any) => ({
        type: mount.Type,
        source: mount.Source,
        destination: mount.Destination,
        mode: mount.Mode,
        rw: mount.RW
    })));
}

export {GET};

export const dynamic = 'force-dynamic'