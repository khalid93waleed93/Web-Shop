import path from 'path';
import dotenv from 'dotenv';

// export const rootDir = path.dirname(require.main?.filename ?? "");
// export const rootDir = path.dirname(typeof require.main !== 'undefined' ? require.main.filename : '');
dotenv.config()
export const rootDir = path.dirname(require.main!.filename)
export const mailjet_secretKey = process.env.MAILJET_SECRET_KEY;
export const mailjet_apiKey = process.env.MAILJET_API_KEY;
export const mongoDB_URL = process.env.NODE_ENV === 'production' ? process.env.MONGODB_PROD_URL : process.env.MONGODB_DEV_URL;
export const base_URL = process.env.NODE_ENV === 'production' ? process.env.BASE_PROD_URL : process.env.BASE_DEV_URL;