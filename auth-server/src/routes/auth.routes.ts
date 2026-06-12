import { Router, Request, Response, NextFunction } from "express";
import { AppContext } from "../types/app-context.types";
import authMiddleware from "../middleware/auth.middleware";

export default function authRoutes(appContext: AppContext) {
    const router = Router();

    // --- REGISTRATION FLOW ---

    router.post('/register/generate-options', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, role } = req.body;
            
            const { options, user } = await appContext.webAuthnService.getRegistrationOptions(email, role || 'patient');

            res.json({
                success: true,
                options,
                userId: user.id
            });
        } catch (error) {
            next(error);
        }
    });

    router.post('/register/verify', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, body } = req.body;
            
            const verified = await appContext.webAuthnService.verifyRegistration(userId, body);

            if (verified) {
                // Registration successful, log them in immediately by creating a session
                const user = await appContext.authService.getCurrentUser(userId);

                const sessionId = await appContext.sessionService.createSession({
                    userId: user.id,
                    role: user.role
                });

                res.cookie("sessionId", sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
                });

                res.status(201).json({
                    success: true,
                    message: "Registered and authenticated successfully",
                    user
                });
            } else {
                res.status(400).json({ success: false, message: "Registration verification failed" });
            }
        } catch (error) {
            next(error);
        }
    });

    // --- LOGIN FLOW ---

    router.post('/login/generate-options', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            
            const { options, user } = await appContext.webAuthnService.getAuthenticationOptions(email);

            res.json({
                success: true,
                options,
                userId: user.id
            });
        } catch (error) {
            next(error);
        }
    });

    router.post('/login/verify', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, body } = req.body;
            
            const verified = await appContext.webAuthnService.verifyAuthentication(userId, body);

            if (verified) {
                const user = await appContext.authService.getCurrentUser(userId);

                const sessionId = await appContext.sessionService.createSession({
                    userId: user.id,
                    role: user.role
                });

                res.cookie("sessionId", sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
                });

                res.json({
                    success: true,
                    message: "Logged In",
                    user
                });
            } else {
                res.status(400).json({ success: false, message: "Authentication failed" });
            }
        } catch (error) {
            next(error);
        }
    });

    // --- SESSION UTILS ---

    router.post('/logout', authMiddleware(appContext), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionId = req.cookies.sessionId;
            
            if (sessionId && req.user) {
                await appContext.authService.logout(sessionId, req.user.userId, req.requestId);
            }

            res.clearCookie("sessionId");
            res.json({
                success: true,
                message: "Logged Out"
            });
        } catch (error) {
            next(error);
        }
    });

    router.get('/me', authMiddleware(appContext), async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const user = await appContext.authService.getCurrentUser(req.user.userId);
            
            res.json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    });

    return router;
}