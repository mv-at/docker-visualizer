import app from 'express'
import * as http from "http";
import * as url from "url";
import {existsSync} from "node:fs";
import * as os from "node:os";


if (!existsSync('/var/run/docker.sock')) {
    console.error('Docker socket not found - please mount the docker socket to /var/run/docker.sock')
    process.exit(1)
}

if (!process.env.DOCKER_PROXY_SECRET) {
    console.error('Please provide a secret key for the proxy in the environment variable DOCKER_PROXY_SECRET')
    process.exit(1)
}

const express = app();

express.get('/', (req, res) => {
    res.send('docker-proxy is running')
});

express.all(['/', '/*'], (req, res) => {
    if (req.headers['docker-auth'] !== process.env.DOCKER_PROXY_SECRET) {
        res.status(401).send('Unauthorized')
        console.log(req.method, req.path , '=> 401');
        return
    }
    const requestUrl = url.parse(url.format({
        protocol: 'http',
        hostname: 'localhost',
        pathname: req.path,
        query: req.query
    }));
    const options = {
        socketPath: '/var/run/docker.sock',
        path: requestUrl.path,
        method: req.method,
        body: req.body,
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Docker-Server-Name', process.env.DOCKER_SERVER_NAME || os.hostname())
    const request = http.request(options, (response) => {
        console.log(req.method, req.path, ' => ', response.statusCode);
        response.pipe(res);
    })
    request.end()
})

express.listen(4000, '0.0.0.0', () => {
    console.log('docker-proxy is running on port 4000')
})
