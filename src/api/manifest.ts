import { Request, Response } from 'express';

import config from '../config';
import { Manifest } from '../types';
import manifest from '../manifest.json';

export function getManifest(request: Request, response: Response): void {
    const m: Manifest = manifest;

    m.http.root_url = `${getHTTPPath()}`;

    response.json(m);
}

function getPort(): number {
    return Number(process.env.PORT) || config.APP.PORT;
}

export function getHTTPPath(): string {
    if (!`${config.APP.HOST}`.includes('https')) {
        return `${config.APP.HOST}:${getPort()}`;
    }
    return config.APP.HOST;
}
