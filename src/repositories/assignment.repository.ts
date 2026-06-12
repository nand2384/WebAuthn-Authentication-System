import { Pool } from "pg";

export default class AssignmentRepository {
    constructor(private pool: Pool) {}

    async isDoctorAssignedToPatient(doctorId: string, patientId: string): Promise<boolean> {
        const result = await this.pool.query(
            `SELECT 1 FROM patient_doctor_assignments 
            WHERE doctor_id = $1 AND patient_id = $2`,
            [doctorId, patientId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
}
