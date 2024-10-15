import {NextRequest} from "next/server";
import {stat} from "fs/promises";
import path from "node:path";
import {translateImage} from "@/lib/image";

const isFile = async (path: string) => {
    try {
        const stats = await stat(path);
        return stats.isFile();
    } catch (e) {
        return false;
    }
}

const findPath = async (basePath: string, registry: string, publisher: string, name: string) => {
    const parts = [registry, ...publisher.split('/'), name];
    while (parts.length > 0) {
        if (await isFile(path.join(basePath, ...parts) + '.svg'))
            return 'imageicon/' + parts.join('/') + '.svg';
        if (await isFile(path.join(basePath, ...parts) + '.png'))
            return 'imageicon/' + parts.join('/') + '.png';
        parts.pop();
    }
    return 'img/container.svg';
}

const GET = async (req: NextRequest) => {
    const baseUrl = req.headers.get('referer') || (req.nextUrl.protocol + '//' + req.nextUrl.host + '/');
    let image = req.nextUrl.searchParams.get('image');
    if (image)
        image = decodeURIComponent(image);
    if (!image || image.startsWith('sha256:')) return Response.redirect(baseUrl + 'img/container.svg', 302);
    try {
        const imageData = translateImage(image);

        const basePath = process.env.ICON_PATH;
        if (!basePath || !imageData) return Response.redirect(baseUrl + 'img/container.svg', 302);
        return Response.redirect(baseUrl + await findPath(basePath, imageData.registry, imageData.publisher, imageData.name), 302);
    } catch (e) {
        console.error(e);
        return Response.redirect(baseUrl + 'img/container.svg', 302);
    }
}

export { GET } ;

export const dynamic = 'force-dynamic'