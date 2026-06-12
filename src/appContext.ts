import pool from "./database/db";
import UserRepository from "./repositories/user.repository";
import SessionRepository from "./repositories/session.repository";
import AuditRepository from "./repositories/audit.repository";
import AssignmentRepository from "./repositories/assignment.repository";
import PasskeyRepository from "./repositories/passkey.repository";
import AuthService from "./services/auth.service";
import LoggerService from "./services/logger.service";
import SessionService from "./services/session.service";
import PatientService from "./services/patient.service";
import WebAuthnService from "./services/webauthn.service";

export interface AppContext {
    loggerService: LoggerService;
    sessionService: SessionService;
    userRepository: UserRepository;
    sessionRepository: SessionRepository;
    auditRepository: AuditRepository;
    assignmentRepository: AssignmentRepository;
    passkeyRepository: PasskeyRepository;
    authService: AuthService;
    patientService: PatientService;
    webAuthnService: WebAuthnService;
}

const userRepository = new UserRepository(pool);
const sessionRepository = new SessionRepository(pool);
const auditRepository = new AuditRepository(pool);
const assignmentRepository = new AssignmentRepository(pool);
const passkeyRepository = new PasskeyRepository(pool);

const loggerService = new LoggerService();
const sessionService = new SessionService(sessionRepository, loggerService);
const webAuthnService = new WebAuthnService(userRepository, passkeyRepository);
const authService = new AuthService(userRepository, sessionService, loggerService, auditRepository);
const patientService = new PatientService(userRepository, assignmentRepository, auditRepository, loggerService);

const appContext: AppContext = {
    loggerService,
    sessionService,
    userRepository,
    sessionRepository,
    auditRepository,
    assignmentRepository,
    passkeyRepository,
    authService,
    patientService,
    webAuthnService
};

export default appContext;