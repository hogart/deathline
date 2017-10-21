import { stat as _stat} from 'fs';
import { isAbsolute } from 'path';
import * as util from 'util';

const stat = util.promisify(_stat);

interface IUrl {
    src: string;
}
interface ISource {
    source: string;
}
type TFileOptions = IUrl | ISource;

const pathsCache: Map<string, TFileOptions> = new Map();

class NotAFileError extends Error {
    constructor(path: string) {
        super(path);
        this.message = `Path '%{path}' doesn't point to a file (most probably directory)`;
        this.name = 'NotAFileError';
    }
}
// tslint:disable-next-line:max-classes-per-file
class AbsolutePathError extends Error {
    constructor(path: string) {
        super(path);
        this.message = `Absolute paths are not allowed: '${path}'`;
        this.name = 'AbsolutePathError';
    }
}

async function resolveResource(media: string): Promise<TFileOptions> {
    if (media.startsWith('http://') || media.startsWith('https://')) {
        return {
            src: media,
        };
    } else {
        if (isAbsolute(media)) {
            throw new AbsolutePathError(media);
        } else {
            const stats = await stat(media);

            if (stats.isFile()) {
                return {
                    source: media,
                };
            } else {
                throw new NotAFileError(media);
            }
        }
    }
}

async function getAndCache(media: string): Promise<TFileOptions> {
    const options = await resolveResource(media);

    pathsCache.set(media, options);

    return options;
}

export function filePathToOptions(media: string): Promise<TFileOptions> {
    if (pathsCache.has(media)) {
        const options = pathsCache.get(media);
        if (options instanceof Error) {
            return Promise.reject(options);
        } else if (options !== undefined) {
            return Promise.resolve(options);
        } else {
            return getAndCache(media);
        }
    } else {
        return getAndCache(media);
    }
}