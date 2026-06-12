import { Router, Request, Response, NextFunction } from "express";
import { AppContext } from "../types/app-context.types";
import authMiddleware from "../middleware/auth.middleware";

export default function patientRoutes(appContext: AppContext) {
    const router = Router();

    router.get('/:id/profile', authMiddleware(appContext), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const patientId = req.params.id;
            
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const profile = await appContext.patientService.getPatientProfile(
                patientId as string,
                req.user,
                req.requestId as string
            );

            res.json({
                success: true,
                profile
            });
        } catch (error) {
            next(error);
        }
    });

    return router;
}
