const docker_fetch = async (url: string, options?: any) => {

    if (url === undefined)
        return Response.error()

    const dockerApiVersion = 'v1.40'

    let host = process.env.DOCKER_PROXY_HOST || 'http://localhost:4000'
    if (!host.endsWith('/'))
        host += '/'

    const headers = {} as { [key: string]: string };

    if (process.env.DOCKER_PROXY_MODE?.toLowerCase() === 'cloudflare') {
        headers['CF-Access-Client-Id'] = process.env.CF_CLIENT_ID || '';
        headers['CF-Access-Client-Secret'] = process.env.CF_CLIENT_SECRET || '';
    }
    headers['docker-auth'] = process.env.DOCKER_PROXY_SECRET || '';

    return await fetch(host + dockerApiVersion + (url.startsWith('/') ? url : '/' + url), {
        method: options?.method || 'GET',
        headers: headers,
        body: options?.body,
        cache: 'no-cache',
    })
}

export default docker_fetch