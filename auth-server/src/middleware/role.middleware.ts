import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error";

import { UserRole } from "../types/auth.types";
import { AppContext } from "../types/app-context.types";

export default function roleMiddleware(allowedRoles: UserRole[], appContext: AppContext) {
    return function (req: Request, res: Response, next: NextFunction): void {
        appContext.loggerService.info(`[${req.requestId}] Checking Role Access`);
        if(!req.user) {
            appContext.loggerService.warn(`[${req.requestId}] Unauthorized`);
            throw new AppError("Unauthorized", 401);
        }

        const hasAccess = allowedRoles.includes(req.user.role);

        if(!hasAccess) {
            appContext.loggerService.warn(`[${req.requestId}] Access Denied`);
            throw new AppError("Forbidden", 403);
        }
        appContext.loggerService.info(`[${req.requestId}] Access Granted`);
        next();
    };
}