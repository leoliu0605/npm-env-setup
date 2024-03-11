import path from 'path';

export function getAppDir() {
    if (process.pkg && process.pkg.entrypoint) {
        return path.dirname(process.pkg.entrypoint);
    }
    return process.cwd();
}
