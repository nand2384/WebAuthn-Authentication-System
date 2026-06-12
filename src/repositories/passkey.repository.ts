import { Pool } from "pg";

export interface PasskeyCredential {
    id: string;
    user_id: string;
    credential_id: string;
    public_key: Buffer;
    counter: number;
    transports: string[];
    device_type: string;
    backed_up: boolean;
    created_at: Date;
}

export interface CreatePasskeyCredentialData {
    user_id: string;
    credential_id: string;
    public_key: Buffer;
    counter: number;
    transports?: string[];
    device_type: string;
    backed_up: boolean;
}

export default class PasskeyRepository {
    constructor(
        private pool: Pool
    ) {}

    async findByCredentialId(credentialId: string): Promise<PasskeyCredential | undefined> {
        const result = await this.pool.query(
            `SELECT * FROM passkey_credentials WHERE credential_id = $1`,
            [credentialId]
        );
        return result.rows[0];
    }

    async findByUserId(userId: string): Promise<PasskeyCredential[]> {
        const result = await this.pool.query(
            `SELECT * FROM passkey_credentials WHERE user_id = $1`,
            [userId]
        );
        return result.rows;
    }

    async createCredential(data: CreatePasskeyCredentialData): Promise<PasskeyCredential> {
        const result = await this.pool.query(
            `INSERT INTO passkey_credentials (
                user_id, credential_id, public_key, counter, transports, device_type, backed_up
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                data.user_id,
                data.credential_id,
                data.public_key,
                data.counter,
                data.transports || [],
                data.device_type,
                data.backed_up
            ]
        );
        return result.rows[0];
    }

    async updateCounter(credentialId: string, counter: number) {
        await this.pool.query(
            `UPDATE passkey_credentials SET counter = $1 WHERE credential_id = $2`,
            [counter, credentialId]
        );
    }
}
