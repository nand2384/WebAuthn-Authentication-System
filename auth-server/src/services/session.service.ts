import { AuthUser } from "../types/auth.types";
import crypto from "crypto";
import SessionRepository from "../repositories/session.repository";
import LoggerService from "./logger.service";

class SessionService {
    constructor(
        private sessionRepository: SessionRepository,
        private loggerService: LoggerService
    ) {}

    async createSession(user: AuthUser): Promise<string> {
        const sessionId = crypto.randomUUID();
        
        // Expiration in 24 hours
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await this.sessionRepository.createSession({
            id: sessionId,
            userId: user.userId,
            expiresAt
        });

        return sessionId;
    }

    async getSession(sessionId: string): Promise<AuthUser | undefined> {
        const sessionRow = await this.sessionRepository.findById(sessionId);
        
        if (!sessionRow) return undefined;

        if (new Date(sessionRow.expires_at) < new Date()) {
            this.loggerService.info(`Session expired: ${sessionId}`);
            await this.sessionRepository.deleteSession(sessionId);
            return undefined;
        }

        return {
            userId: sessionRow.user_id,
            role: sessionRow.role
        };
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.sessionRepository.deleteSession(sessionId);
    }
}

export default SessionService;