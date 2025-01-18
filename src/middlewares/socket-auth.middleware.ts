import JWT from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { prisma } from "@/db";
import { CONFIGS } from "@/configs";

export default async (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, next: (err?: ExtendedError) => void) => {
    const { authorization } = socket.handshake.auth;
    if (!authorization) return next(new Error("-socket-authentication/no-authorization-found"));

    const token: string = authorization.split(" ")[1] || "";
    const decoded: any = JWT.verify(token, CONFIGS.JWT_SECRET, (err: any, decoded: any) => {
        if (err) return next(new Error("-socket-authentication/jwt-validation-failed"));
        return decoded;
    });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    // user not found
    if (!user) return next(new Error("-socket-authentication/user-not-found"));

    try {
        socket.data.$currentUser = user;
        next();
    } catch (error: any) {
        return next(new Error(`Socket Authentication error: ${error.message}`));
    }
};
