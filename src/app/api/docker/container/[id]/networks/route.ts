import {NextRequest} from "next/server";
import docker_fetch from "@/lib/dockerd";
import {ContainerEnvs, ContainerNetworks, ContainerPort} from "@/types/ContainerData";

const GET = async (req: NextRequest, options: { params: {id: string} }) => {
    if (!process.env.PERMISSION_NETWORKS)
        return Response.json({error: 'Permission denied'}, {status: 401});

    const raw = await docker_fetch('/containers/' + options.params.id + '/json');
    if (raw.status !== 200)
        return Response.error();
    const container = await raw.json();

    const mapNetworks = (rawNetworks: any) => {
        const networks = {} as ContainerNetworks
        // @ts-ignore
        (Object.entries(rawNetworks) as {[name: string]: any}).map(([name, network]) => {
            networks[name] = {
                networkId: network.NetworkID,
                endpointId: network.EndpointID,
                gateway: network.Gateway,
                ipAddress: network.IPAddress,
                ipPrefixLen: network.IPPrefixLen,
                ipv6Gateway: network.IPv6Gateway,
                globalIpv6Address: network.GlobalIPv6Address,
                globalIpv6PrefixLen: network.GlobalIPv6PrefixLen,
                macAddress: network.MacAddress
            }
        });
        return networks;
    }

    const mapPorts = (rawPorts: any) => {
        const ports = [] as ContainerPort[];
        Object.entries(rawPorts).map(([key, value]) => {
            ports.push({
                hostIp: (value as any).HostIp,
                hostPort: (value as any).HostPort,
                port: key.split('/')[0],
                protocol: key.split('/')[1]
            });
        });
        return ports;
    }

    return Response.json({
        networks: mapNetworks(container.NetworkSettings.Networks),
        ports: mapPorts(container.HostConfig.PortBindings)
    });
}

export {GET};

export const dynamic = 'force-dynamic'