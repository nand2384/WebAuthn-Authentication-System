import { Pool } from "pg";

export interface CreateSessionData {
    id: string;
    userId: string;
    expiresAt: Date;
}

export default class SessionRepository {
    constructor(private pool: Pool) {}

    async createSession(sessionData: CreateSessionData) {
        const { id, userId, expiresAt } = sessionData;
        const result = await this.pool.query(
            `INSERT INTO sessions (id, user_id, expires_at)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [id, userId, expiresAt]
        );
        return result.rows[0];
    }

    async findById(id: string) {
        const result = await this.pool.query(
            `SELECT s.*, u.role FROM sessions s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async deleteSession(id: string) {
        await this.pool.query(
            `DELETE FROM sessions WHERE id = $1`,
            [id]
        );
    }

    async deleteExpiredSessions() {
        await this.pool.query(
            `DELETE FROM sessions WHERE expires_at < NOW()`
        );
    }
}
