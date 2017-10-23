import { isAbsolute, resolve, dirname } from 'path';
import { stat as _stat} from 'fs';
import { promisify } from 'util';
import { IGame } from './deathline';

const stat = promisify(_stat);

interface IUrl {
    src: string;
}
interface ISource {
    source: string;
}
type TFileOptions = IUrl | ISource;

// tslint:disable-next-line:max-classes-per-file
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

// tslint:disable-next-line:max-classes-per-file
export class MediaRenderer {
    private pathsCache: Map<string, TFileOptions> = new Map();

    private gameDir: string;

    constructor(game: IGame) {
        this.gameDir = dirname(game.gameFile);
    }

    private isUrl(media: string): boolean {
        return media.startsWith('http://') || media.startsWith('https://');
    }

    private resolvePath(media: string): string {
        return resolve(this.gameDir, media);
    }

    private async resolveResource(media: string): Promise<TFileOptions> {
        if (this.isUrl(media)) {
            return {
                src: media,
            };
        } else {
            if (isAbsolute(media)) {
                throw new AbsolutePathError(media);
            } else {
                const mediaPath = this.resolvePath(media);
                const stats = await stat(mediaPath);

                if (stats.isFile()) {
                    return {
                        source: mediaPath,
                    };
                } else {
                    throw new NotAFileError(mediaPath);
                }
            }
        }
    }

    private async get(media: string): Promise<TFileOptions> {
        const options = await this.resolveResource(media);

        this.pathsCache.set(media, options);

        return options;
    }

    public async renderMedia(media: string): Promise<TFileOptions> {
        if (this.pathsCache.has(media)) {
            const options = this.pathsCache.get(media);
            if (options instanceof Error) {
                throw options;
            } else if (options !== undefined) {
                return options;
            } else {
                return await this.get(media);
            }
        } else {
            return await this.get(media);
        }
    }
}