import { Pool } from "pg";

export interface CreateAuditLogData {
    requestId: string;
    userId: string | null;
    action: string;
}

export default class AuditRepository {
    constructor(private pool: Pool) {}

    async createLog(data: CreateAuditLogData) {
        const { requestId, userId, action } = data;
        const result = await this.pool.query(
            `INSERT INTO audit_logs (request_id, user_id, action)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [requestId, userId, action]
        );
        return result.rows[0];
    }
}
