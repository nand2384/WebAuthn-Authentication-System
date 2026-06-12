import UserRepository from "../repositories/user.repository";
import SessionRepository from "../repositories/session.repository";
import AuditRepository from "../repositories/audit.repository";
import AssignmentRepository from "../repositories/assignment.repository";
import PasskeyRepository from "../repositories/passkey.repository";
import LoggerService from "../services/logger.service";
import SessionService from "../services/session.service";
import AuthService from "../services/auth.service";
import PatientService from "../services/patient.service";
import WebAuthnService from "../services/webauthn.service";

export interface AppContext {
  loggerService: LoggerService;
  sessionService: SessionService;
  authService: AuthService;
  patientService: PatientService;
  webAuthnService: WebAuthnService;
  userRepository: UserRepository;
  sessionRepository: SessionRepository;
  auditRepository: AuditRepository;
  assignmentRepository: AssignmentRepository;
  passkeyRepository: PasskeyRepository;
};