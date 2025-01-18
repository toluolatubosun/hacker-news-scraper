import JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { prisma } from "@/db";
import { CONFIGS } from "@/configs";
import CustomError from "@/utilities/custom-error";

/**
 * If no role is passed the default role is user
 *
 * @param  {any[]} roles List of roles allowed to access the route
 */
function auth(roles: string[] = []) {
    roles = roles.length > 0 ? roles : CONFIGS.APP_ROLES.USER;

    return async (req: Request, _res: Response, next: NextFunction) => {
        if (!req.headers.authorization) throw new CustomError("unauthorized access: token not found", 401);

        const token: string = req.headers.authorization.split(" ")[1] || "";

        const decoded: any = JWT.verify(token, CONFIGS.JWT_SECRET, (err: any, decoded: any) => {
            if (err) throw new CustomError("-middleware/token-expired", 401);
            return decoded;
        });

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        // user not found
        if (!user) throw new CustomError("-middleware/user-not-found", 401);

        // If role is not authorized to access route
        if (!roles.includes(user.role)) throw new CustomError("-middleware/user-not-authorized", 401);

        // Attach user to request
        req.$currentUser = user;

        next();
    };
}

export default auth;
