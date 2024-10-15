import {NextRequest} from "next/server";
import docker_fetch from "@/lib/dockerd";
import {ContainerEnvs} from "@/types/ContainerData";

const GET = async (req: NextRequest, options: { params: {id: string} }) => {
    if (!process.env.PERMISSION_ENVS)
        return Response.json({error: 'Permission denied'}, {status: 401});

    const raw = await docker_fetch('/containers/' + options.params.id + '/json');
    if (raw.status !== 200)
        return Response.error();
    const container = await raw.json();

    const mapEnvs = (rawEnvs: any) => {
        const envs = {} as ContainerEnvs;
        rawEnvs.forEach((env: string) => {
            const [key, value] = env.split('=');
            envs[key] = value;
        });
        return envs;
    }

    return Response.json(mapEnvs(container.Config.Env));
}

export {GET};

export const dynamic = 'force-dynamic'