import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
];

for(const envVar of requiredEnvVars) {
    if(!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const env = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: process.env.DB_PORT!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
};

export default env;