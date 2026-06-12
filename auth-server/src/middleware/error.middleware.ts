import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error";

export default function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(error.message);

    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message
    });
};