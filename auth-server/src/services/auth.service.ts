import AppError from "../utils/app-error";
import UserRepository from "../repositories/user.repository";
import SessionService from "./session.service";
import LoggerService from "./logger.service";
import AuditRepository from "../repositories/audit.repository";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default class AuthService {
    constructor(
        private userRepository: UserRepository,
        private sessionService: SessionService,
        private loggerService: LoggerService,
        private auditRepository: AuditRepository
    ) {}

    // Password-based register and login methods have been removed 
    // in favor of Passkey/WebAuthn flows handled by WebAuthnService.

    async logout(sessionId: string, userId: string, requestId: string) {
        await this.sessionService.deleteSession(sessionId);
        this.loggerService.info(`User logged out: ${userId}`);

        await this.auditRepository.createLog({
            requestId,
            userId,
            action: "logout"
        });
    }

    async getCurrentUser(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    }
}