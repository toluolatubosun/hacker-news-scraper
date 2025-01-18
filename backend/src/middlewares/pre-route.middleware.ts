import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express, { Express } from "express";

import { CONFIGS } from "@/configs";

const configurePreRouteMiddleware = (app: Express): Express => {
    // enable CORS
    app.use(
        cors({
            credentials: true,
            origin: [...CONFIGS.CORS_ALLOWED_ORIGINS]
        })
    );

    // Secure the app by setting various HTTP headers off.
    app.use(helmet({ contentSecurityPolicy: false }));

    // Enable HTTP request logging
    app.use(morgan("common"));

    // Tell express to recognize the incoming Request Object as a JSON Object
    app.use(express.json());

    // Express body parser
    app.use(express.urlencoded({ extended: true }));

    return app;
};

export { configurePreRouteMiddleware };
