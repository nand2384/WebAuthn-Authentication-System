import { AuthUser } from "../auth.types";
import { Request } from 'express';

export {}; // Crucial: Makes TypeScript treat this as a module

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: AuthUser;
    }
  }
}

/**
 * Solution for updated Request Type if the above given doesn't work
 */

// export interface AuthenticatedRequest extends Request {
//     requestId: string;
//     user?: AuthUser;
// }
