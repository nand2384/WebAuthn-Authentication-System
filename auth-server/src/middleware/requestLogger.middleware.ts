import { Request, Response, NextFunction } from "express";

export default function requestLogger(req: Request, res: Response, next: NextFunction): void {
    console.log(`[${req.requestId}] [REQUEST] ${req.method} ${req.originalUrl}`);

    next();
};