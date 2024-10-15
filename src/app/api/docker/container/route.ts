import {NextRequest} from "next/server";
import docker_fetch from "@/lib/dockerd";
import {ContainerData} from "@/types/ContainerData";
import * as os from "node:os";

const GET = async (req: NextRequest, options: { params: {} }) => {

    const raw = await docker_fetch('/containers/json?all=true');
    if (raw.status !== 200)
        return Response.error();
    const rawData = await raw.json();

    const permissions: string[] = []
    if (process.env.PERMISSION_START_STOP)
        permissions.push("start")
    if (process.env.PERMISSION_DELETE)
        permissions.push("delete")
    if (process.env.PERMISSION_LOGS)
        permissions.push("logs")
    if (process.env.PERMISSION_INFO)
        permissions.push("info")
    if (process.env.PERMISSION_ACCESS)
        permissions.push("access")
    if (process.env.PERMISSION_ENVS)
        permissions.push("envs")
    if (process.env.PERMISSION_VOLUMES)
        permissions.push("volumes")
    if (process.env.PERMISSION_NETWORKS)
        permissions.push("networks")

    const server = process.env.DOCKER_HOST_NAME || os.hostname();

    const containers: ContainerData[] = rawData.map((container: any) => ({
        id: container.Id,
        name: container.Names[0],
        image: container.Image,
        imageID: container.ImageID,
        command: container.Command,
        created: container.Created * 1000,
        state: container.State,
        status: container.Status,
        permissions,
        server: raw.headers.get('Docker-Server-Name') || os.hostname()
    }))

    return Response.json(containers);
}

export {GET};

export const dynamic = 'force-dynamic'