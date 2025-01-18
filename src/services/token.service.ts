import crypto from "crypto";
import JWT from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { prisma } from "@/db";
import { CONFIGS } from "@/configs";
import { TOKEN_TYPES } from "@/constants";

class TokenService {
    async generateAuthTokens(user: { id: string }) {
        // Generate random refresh-token and hash it
        const refreshToken = crypto.randomBytes(32).toString("hex");

        // Encrypt refresh-token
        const hashedRefreshToken = await bcryptjs.hash(refreshToken, CONFIGS.BCRYPT_SALT_ROUNDS);

        // Save refresh-token in database
        await prisma.token.create({
            data: {
                userId: user.id,
                token: hashedRefreshToken,
                type: TOKEN_TYPES.REFRESH
            }
        });

        // Generate access token and refresh-token JWT
        const accessTokenJWT = JWT.sign({ id: user.id }, CONFIGS.JWT_SECRET, { expiresIn: CONFIGS.ACCESS_TOKEN_JWT_EXPIRES_IN / 1000 });
        const refreshTokenJWT = JWT.sign({ id: user.id, refreshToken: refreshToken }, CONFIGS.JWT_SECRET, { expiresIn: CONFIGS.REFRESH_TOKEN_JWT_EXPIRES_IN / 1000 });

        return { access_token: accessTokenJWT, refresh_token: refreshTokenJWT };
    }

    async refreshAuthTokens(refreshTokenJWT: string) {
        // Decode refresh-token
        const decodedRefreshToken = JWT.verify(refreshTokenJWT, CONFIGS.JWT_SECRET) as { id: string; refreshToken: string };

        // Find refresh-tokens for user in database
        const refreshTokens = await prisma.token.findMany({
            where: { userId: decodedRefreshToken.id, type: TOKEN_TYPES.REFRESH }
        });
        if (refreshTokens.length === 0) throw new Error("Invalid or expired token");

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decodedRefreshToken.id }
        });
        if (!user) throw new Error("Invalid or expired token");

        // for each refresh-token, check if it matches the decoded refresh-token
        for (const singleToken of refreshTokens) {
            const isValid = await bcryptjs.compare(decodedRefreshToken.refreshToken, singleToken.token);

            if (isValid) {
                // Delete the previous refresh-token from database
                await prisma.token.delete({ where: { id: singleToken.id } });

                // Generate new access token and refresh-token JWT
                return await this.generateAuthTokens({ id: user.id });
            }
        }

        throw new Error("Invalid or expired token");
    }

    async revokeRefreshToken(refreshTokenJWT: string) {
        // Decode refresh-token
        const decodedRefreshToken = JWT.verify(refreshTokenJWT, CONFIGS.JWT_SECRET) as { id: string; refreshToken: string };

        // Find refresh-tokens for user in database
        const refreshTokens = await prisma.token.findMany({
            where: { userId: decodedRefreshToken.id, type: TOKEN_TYPES.REFRESH }
        });
        if (refreshTokens.length === 0) throw new Error("Invalid or expired token");

        // for each refresh-token, check if it matches the decoded refresh-token
        for (const singleToken of refreshTokens) {
            const isValid = await bcryptjs.compare(decodedRefreshToken.refreshToken, singleToken.token);

            if (isValid) {
                // Delete the refresh-token from database
                await prisma.token.delete({ where: { id: singleToken.id } });

                return true;
            }
        }

        throw new Error("Invalid or expired token");
    }
}

export default new TokenService();
