import { User } from '@prisma/client'; // vagy importáld a saját User típusodat

declare global {
  namespace Express {
    interface Request {
      user?: User; // A Passport által hozzáadott user objektum
    }
  }
}
