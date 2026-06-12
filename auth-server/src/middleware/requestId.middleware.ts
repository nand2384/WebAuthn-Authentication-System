import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export default function requestId(req: Request, res: Response, next: NextFunction): void {
    (req as Request).requestId = crypto.randomUUID();
    next();
};