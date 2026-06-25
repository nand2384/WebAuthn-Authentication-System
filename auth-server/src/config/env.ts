import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
];

for(const envVar of requiredEnvVars) {
    if(!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const env = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    DATABASE_URL: process.env.DATABASE_URL!,
};

export default env;