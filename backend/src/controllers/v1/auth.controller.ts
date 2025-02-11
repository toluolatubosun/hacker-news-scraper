import { Request, Response } from "express";

import response from "@/utilities/response";
import AuthService from "@/services/v1/auth.service";

class AuthController {
    async register(req: Request, res: Response) {
        const result = await AuthService.register(req);
        res.status(201).send(response("new user registered", result));
    }

    async login(req: Request, res: Response) {
        const result = await AuthService.login(req);
        res.status(200).send(response("user login successful", result));
    }

    async refreshTokens(req: Request, res: Response) {
        const result = await AuthService.refreshTokens(req);
        res.status(200).send(response("token refreshed", result));
    }

    async logout(req: Request, res: Response) {
        const result = await AuthService.logout(req);
        res.status(200).send(response("user logout successful", result));
    }
}

export default new AuthController();
