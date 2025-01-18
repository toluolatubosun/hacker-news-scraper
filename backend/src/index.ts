// set timezone
process.env.TZ = "Africa/Lagos";

import "express-async-errors";

import bcryptjs from "bcryptjs";
import { createServer } from "http";
import express, { Express } from "express";
import { Server as SocketIO } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import router from "@/routes";
import { CONFIGS } from "@/configs";
import { startCronJobs } from "@/cron-jobs";
import SocketHandler from "@/services/socket-handler.service";
import { configureErrorMiddleware } from "@/middlewares/error.middleware";
import { configurePreRouteMiddleware } from "@/middlewares/pre-route.middleware";
import socketAuthenticationMiddleware from "./middlewares/socket-auth.middleware";

const app: Express = express();
const httpServer = createServer(app);

// Socket IO Initialization
export const io = new SocketIO(httpServer, {
    cors: {
        credentials: true,
        origin: [...CONFIGS.CORS_ALLOWED_ORIGINS]
    }
});

// Socket IO Admin UI
instrument(io, {
    auth: {
        type: "basic",
        username: CONFIGS.SOCKET_IO.USERNAME,
        password: bcryptjs.hashSync(CONFIGS.SOCKET_IO.PASSWORD, 10)
    }
});

// Pre Route Middlewares
configurePreRouteMiddleware(app);

app.use(router);

// Error Handler Middleware
configureErrorMiddleware(app);

const PORT: number | string = process.env.PORT || 4000;

// Listen to server port
httpServer.listen(PORT, async () => {
    console.log(`::> Server running on PORT: ${PORT}`);

    // Start Cron Jobs
    startCronJobs();

    // Socket IO Auth Middleware
    io.use(socketAuthenticationMiddleware).on("connection", (socket) => {
        new SocketHandler(socket).start();
    });
});

// On server error
app.on("error", (error) => {
    console.error(`<::: An error occurred on the server: \n ${error}`);
});
