import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error";
import { AppContext } from "../types/app-context.types";

export default function authMiddleware(appContext: AppContext) {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            appContext.loggerService.info(`[${req.requestId}] Authenticating Request`);

            const sessionId = req.cookies.sessionId;

            if (!sessionId || typeof sessionId !== "string") {
                appContext.loggerService.warn(`[${req.requestId}] Missing Session ID`);
                throw new AppError("Unauthorized", 401);
            }

            const session = await appContext.sessionService.getSession(sessionId);

            if (!session) {
                appContext.loggerService.warn(`[${req.requestId}] Invalid Session`);
                throw new AppError("Invalid Session", 401);
            }

            req.user = {
                userId: session.userId,
                role: session.role,
            };
            appContext.loggerService.info(`[${req.requestId}] Session Authenticated`);

            next();
        } catch (error) {
            next(error);
        }
    }
}