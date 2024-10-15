export enum ContainerState {
    "created" = "created",
    "restarting" = "restarting",
    "running" = "running",
    "paused" = "paused",
    "exited" = "exited"
}

export enum MountType {
    "bind" = "bind",
    "volume" = "volume",
    "tmpfs" = "tmpfs",
    "npipe" = "npipe"
}

export type ContainerData = {
    id: string,
    name: string,
    image: string,
    imageId: string,
    command: string,
    created: number,
    state: ContainerState,
    status: string,
    permissions: string[],
    server: string
}

export type ContainerPort = {
    "hostIp": string,
    "hostPort": number,
    "port": string,
    "protocol": string
}

export type ContainerNetworks = {
    [name: string]: {
        "networkId": string,
        "endpointId": string,
        "gateway": string,
        "ipAddress": string,
        "ipPrefixLen": number,
        "ipv6Gateway": string,
        "globalIpv6Address": string,
        "globalIpv6PrefixLen": number,
        "macAddress": string,
    }
}

export type ContainerMount = {
    "type": MountType,
    "source": string,
    "destination": string,
    "mode": string,
    "rw": boolean,
}

export type ContainerInfo = {
    labels: {[key: string]: string}
}

export type ContainerEnvs = {
    [key: string]: string
}