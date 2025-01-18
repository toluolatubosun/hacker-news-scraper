import packageInfo from "../../package.json";

// How to use this:
// ============================================================
// This file is used to store all the environment variables and constants used in the application.

// # To add a new variable:
// ============================================================
// - For environment variables & constants that are the same across all environments, add them to the GLOBAL_CONSTANTS object.
// - For environment-specific variables (i.e they change depending on the environment), add them to the environment's object in each of the CONFIG_BUILDER object.

// # To add a new environment:
// ============================================================
// 1. Add a new key to the CONFIG_BUILDER object with the environment name.
// 2. Duplicate the development object and replace the values with the new environment's values.

const APP_VERSION = packageInfo.version;
const DEPLOYMENT_ENV = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || "development";

const GLOBAL_CONSTANTS = {
    // System Constants
    // ============================================================
    APP_NAME: "hacker-news-scraper-frontend",

    AUTH: {
        ACCESS_TOKEN_NAME: "access-token" as const,
        REFRESH_TOKEN_NAME: "refresh-token" as const,
        UNAUTHORIZED_REDIRECT: "/signin" as const,
        AUTHORIZED_REDIRECT: "/live" as const
    }
} as const;

const CONFIG_BUILDER = {
    development: {
        ...GLOBAL_CONSTANTS,

        URL: {
            API_BASE_URL: "http://localhost:4000",
            PLATFORM_BASE_URL: "http://localhost:3000",
            SOCKET_URL: "ws://localhost:4000"
        }

        // e.g
        // STRIPE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },
    },

    production: {
        ...GLOBAL_CONSTANTS,

        URL: {
            API_BASE_URL: "https://api.example.vercel.app",
            PLATFORM_BASE_URL: "https://example.vercel.app",
            SOCKET_URL: "wss://api.example.vercel.app"
        }

        // e.g
        // STRIPE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },
    }
} as const;

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
    throw new Error(`Invalid DEPLOYMENT_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIGS = CONFIG_BUILDER[DEPLOYMENT_ENV as keyof typeof CONFIG_BUILDER];

// Uncomment below to check configs set
// console.log("CONFIGS:", CONFIGS);

export { DEPLOYMENT_ENV, APP_VERSION, CONFIGS };
