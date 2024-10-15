import {NextRequest} from "next/server";
import docker_fetch from "@/lib/dockerd";
import {ContainerData, ContainerState} from "@/types/ContainerData";
import TimeAgo from "javascript-time-ago";
import * as os from "node:os";

const GET = async (req: NextRequest, options: { params: {id: string} }) => {
    const raw = await docker_fetch('/containers/' + options.params.id + '/json');
    if (raw.status !== 200)
        return Response.error();
    const container = await raw.json();

    const getStatus = (container: any): string => {
        TimeAgo.addDefaultLocale(require('javascript-time-ago/locale/en'));
        const timeAgo = new TimeAgo('en-US');
        if (container.State.Running)
            return 'Up ' + timeAgo.format(new Date(container.State.StartedAt)).replaceAll(' ago', '') + (container.State.Health ? ' (' + container.State.Health.Status + ')' : '').replace('in a moment', 'just now');
        else if (container.State.Paused)
            return 'Paused ' + timeAgo.format(new Date(container.State.StartedAt)).replaceAll(' ago', '').replace('in a moment', 'just now');
        else if (container.State.Restarting)
            return 'Restarting';
        else
            return 'Exited (' + container.State.ExitCode + ') ' + timeAgo.format(new Date(container.State.FinishedAt)).replace('in a moment', 'just now');
    }

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

    const containerData: ContainerData = {
        id: container.Id,
        name: container.Name,
        image: container.Config.Image,
        imageId: container.Image,
        command: container.Config.Cmd?.join(' '),
        created: new Date(container.Created).getTime(),
        state: container.State.Status as ContainerState,
        status: getStatus(container),
        permissions,
        server: raw.headers.get('Docker-Server-Name') || os.hostname()
    }

    return Response.json(containerData);
}

export {GET};