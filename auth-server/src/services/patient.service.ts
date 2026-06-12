import AppError from "../utils/app-error";
import UserRepository from "../repositories/user.repository";
import AssignmentRepository from "../repositories/assignment.repository";
import AuditRepository from "../repositories/audit.repository";
import LoggerService from "./logger.service";

export default class PatientService {
    constructor(
        private userRepository: UserRepository,
        private assignmentRepository: AssignmentRepository,
        private auditRepository: AuditRepository,
        private loggerService: LoggerService
    ) {}

    async getPatientProfile(patientId: string, requestUser: { userId: string, role: string }, requestId: string) {
        const { userId, role } = requestUser;

        if (role === 'admin') {
            this.loggerService.warn(`Admin attempted to view patient profile: ${patientId}`);
            throw new AppError("Admins are not allowed to view medical profiles", 403);
        }

        if (role === 'patient' && patientId !== userId) {
            this.loggerService.warn(`Patient ${userId} attempted to view another patient's profile: ${patientId}`);
            throw new AppError("You can only view your own profile", 403);
        }

        if (role === 'doctor') {
            const isAssigned = await this.assignmentRepository.isDoctorAssignedToPatient(userId, patientId);
            if (!isAssigned) {
                this.loggerService.warn(`Doctor ${userId} attempted to view unassigned patient: ${patientId}`);
                throw new AppError("You are not assigned to this patient", 403);
            }
        }

        const patient = await this.userRepository.findById(patientId);
        if (!patient || patient.role !== 'patient') {
            throw new AppError("Patient not found", 404);
        }

        // Log access
        await this.auditRepository.createLog({
            requestId,
            userId,
            action: `view_profile_${patientId}`
        });

        this.loggerService.info(`User ${userId} viewed patient profile ${patientId}`);

        return {
            id: patient.id,
            email: patient.email,
            role: patient.role,
            // Mock medical data
            medicalHistory: [
                "Blood test normal",
                "Annual physical checkup"
            ]
        };
    }
}
