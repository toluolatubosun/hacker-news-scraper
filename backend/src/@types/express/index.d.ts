import { Prisma } from "@prisma/client";

declare global {
    namespace Express {
        export interface Request {
            $currentUser?: Omit<Prisma.UserGroupByOutputType, "_count" | "_min" | "_max">;
        }
    }
}
