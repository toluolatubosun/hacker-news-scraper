import express, { Router, Request, Response } from "express";

import { APP_VERSION, DEPLOYMENT_ENV } from "@/configs";
import trimIncomingRequests from "@/middlewares/trim-incoming.middleware";

const router: Router = express.Router();

// Trim edge whitespaces from incoming requests
router.use(trimIncomingRequests);

router.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        version: APP_VERSION,
        environment: DEPLOYMENT_ENV,
        server_timezone: process.env.TZ,
        server_time: new Date().toISOString(),
        message: "Hello world from Hacker News Scraper API"
    });
});

export default router;
