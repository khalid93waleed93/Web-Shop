import path from 'path';
// export const rootDir = path.dirname(require.main?.filename ?? "");
// export const rootDir = path.dirname(typeof require.main !== 'undefined' ? require.main.filename : '');
export const rootDir = path.dirname(require.main!.filename)