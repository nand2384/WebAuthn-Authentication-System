import { Pool } from "pg";

export interface CreateUserData {
    id: string;
    email: string;
    role: string;
}

export default class UserRepository {
    constructor(
        private pool: Pool
    ) {}

    async findByEmail(email: string) {
        const result = await this.pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        return result.rows[0];
    }

    async findById(id: string) {
        const result = await this.pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    async createUser(userData: CreateUserData) {
        const { id, email, role } = userData;

        const result = await this.pool.query(
            `INSERT INTO users (id, email, role)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [id, email, role]
        );

        return result.rows[0];
    }

    async updateChallenge(userId: string, currentChallenge: string | null) {
        const result = await this.pool.query(
            `UPDATE users SET current_challenge = $1 WHERE id = $2 RETURNING *`,
            [currentChallenge, userId]
        );
        return result.rows[0];
    }
}