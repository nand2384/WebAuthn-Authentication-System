import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { randomUUID } from 'crypto';
import UserRepository from '../repositories/user.repository';
import PasskeyRepository from '../repositories/passkey.repository';
import AppError from '../utils/app-error';

// These should be configured in .env for production (e.g., rpID: 'sarjanhealthcare.com', expectedOrigin: 'https://app.sarjanhealthcare.com')
const rpName = 'Sarjan Healthcare';
const rpID = process.env.RP_ID || 'localhost';
const expectedOrigin = process.env.EXPECTED_ORIGIN || 'http://localhost:5173';

export default class WebAuthnService {
    constructor(
        private userRepository: UserRepository,
        private passkeyRepository: PasskeyRepository
    ) {}

    async getRegistrationOptions(email: string, role: string) {
        let user = await this.userRepository.findByEmail(email);

        // If user doesn't exist, we create a temporary stub for them without a password
        if (!user) {
            user = await this.userRepository.createUser({
                id: randomUUID(),
                email,
                role
            });
        }

        const userPasskeys = await this.passkeyRepository.findByUserId(user.id);

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from(user.id)),
            userName: user.email,
            timeout: 60000,
            attestationType: 'none',
            excludeCredentials: userPasskeys.map(passkey => ({
                id: passkey.credential_id,
                transports: passkey.transports as any,
            })),
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'preferred',
            },
        });

        // Store challenge in DB to verify later
        await this.userRepository.updateChallenge(user.id, options.challenge);

        return { options, user };
    }

    async verifyRegistration(userId: string, body: any) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.current_challenge) {
            throw new AppError('Registration challenge not found or expired', 400);
        }

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: body,
                expectedChallenge: user.current_challenge,
                expectedOrigin,
                expectedRPID: rpID,
                requireUserVerification: false,
            });
        } catch (error: any) {
            throw new AppError(error.message, 400);
        }

        const { verified, registrationInfo } = verification;

        if (verified && registrationInfo) {
            const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;

            await this.passkeyRepository.createCredential({
                user_id: user.id,
                credential_id: credential.id,
                public_key: Buffer.from(credential.publicKey),
                counter: credential.counter,
                device_type: credentialDeviceType,
                backed_up: credentialBackedUp,
                transports: body.response.transports
            });

            // Clear challenge
            await this.userRepository.updateChallenge(user.id, null);

            return true;
        }

        return false;
    }

    async getAuthenticationOptions(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const userPasskeys = await this.passkeyRepository.findByUserId(user.id);
        if (!userPasskeys.length) {
            throw new AppError('No passkeys registered for this user', 400);
        }

        const options = await generateAuthenticationOptions({
            rpID,
            timeout: 60000,
            allowCredentials: userPasskeys.map(passkey => ({
                id: passkey.credential_id,
                transports: passkey.transports as any,
            })),
            userVerification: 'preferred',
        });

        await this.userRepository.updateChallenge(user.id, options.challenge);

        return { options, user };
    }

    async verifyAuthentication(userId: string, body: any) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.current_challenge) {
            throw new AppError('Authentication challenge not found or expired', 400);
        }

        const passkey = await this.passkeyRepository.findByCredentialId(body.id);
        if (!passkey) {
            throw new AppError('Authenticator is not registered with this site', 400);
        }

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: body,
                expectedChallenge: user.current_challenge,
                expectedOrigin,
                expectedRPID: rpID,
                credential: {
                    id: passkey.credential_id,
                    publicKey: new Uint8Array(passkey.public_key),
                    counter: passkey.counter,
                    transports: passkey.transports as any,
                },
            });
        } catch (error: any) {
            throw new AppError(error.message, 400);
        }

        const { verified, authenticationInfo } = verification;

        if (verified && authenticationInfo) {
            await this.passkeyRepository.updateCounter(passkey.credential_id, authenticationInfo.newCounter);
            await this.userRepository.updateChallenge(user.id, null);
            return true;
        }

        return false;
    }
}
