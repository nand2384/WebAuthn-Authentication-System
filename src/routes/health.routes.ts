import { Router, Request, Response } from "express";
import AppError from "../utils/app-error";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";
import { AppContext } from "../types/app-context.types";
// import { AuthenticatedRequest } from "../types/express";

export default function healthRoutes(appContext: AppContext) {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
        appContext.loggerService.info("Health check requested");
        console.log((req as Request).requestId);

        throw new AppError("Health Route Exploded", 404);
    });

    router.get('/admin', authMiddleware(appContext), roleMiddleware(["admin"], appContext), (req: Request, res: Response) => {
        res.json({
            success: true,
            user: req.user
        });
    })

    return router;
};