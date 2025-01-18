import { z } from "zod";
import bcryptjs from "bcryptjs";
import { Request } from "express";

import { prisma } from "@/db";
import { CONFIGS } from "@/configs";
import CustomError from "@/utilities/custom-error";
import TokenService from "@/services/token.service";
import { extractZodError } from "@/utilities/helpful-methods";

class AuthService {
    async register({ body }: Partial<Request>) {
        const { error, data } = z
            .object({
                body: z.object({
                    name: z.string().trim().optional(),
                    email: z.string().trim(),
                    password: z.string().min(6).trim()
                })
            })
            .safeParse({ body });
        if (error) throw new CustomError(extractZodError(error));

        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.body.email
            }
        });
        if (existingUser) throw new CustomError("User already exists", 400);

        const hashedPassword = await bcryptjs.hash(data.body.password, CONFIGS.BCRYPT_SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email: data.body.email,
                password: hashedPassword,
                name: data.body.name || null
            }
        });

        const tokens = await TokenService.generateAuthTokens(user);

        return { user, tokens };
    }

    async login({ body }: Partial<Request>) {
        const { error, data } = z
            .object({
                body: z.object({
                    email: z.string().trim(),
                    password: z.string().trim()
                })
            })
            .safeParse({ body });
        if (error) throw new CustomError(extractZodError(error));

        const user = await prisma.user.findUnique({
            where: {
                email: data.body.email
            }
        });
        if (!user) throw new CustomError("Invalid email or password", 400);

        const isValid = await bcryptjs.compare(data.body.password, user.password);
        if (!isValid) throw new CustomError("Invalid email or password", 400);

        const tokens = await TokenService.generateAuthTokens(user);

        return { user, tokens };
    }

    async refreshTokens({ body }: Partial<Request>) {
        const { error, data } = z
            .object({
                body: z.object({
                    refresh_token: z.string().trim()
                })
            })
            .safeParse({ body });
        if (error) throw new CustomError(extractZodError(error));

        // verify and refresh tokens
        const refreshedTokens = await TokenService.refreshAuthTokens(data.body.refresh_token);

        return refreshedTokens;
    }

    async logout({ body }: Partial<Request>) {
        const { error, data } = z
            .object({
                body: z.object({
                    refresh_token: z.string().trim()
                })
            })
            .safeParse({ body });
        if (error) throw new CustomError(extractZodError(error));

        // revoke refresh token
        await TokenService.revokeRefreshToken(data.body.refresh_token);

        return true;
    }
}

export default new AuthService();
