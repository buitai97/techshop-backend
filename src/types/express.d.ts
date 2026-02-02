import { Product, Role } from '@prisma/client';
import { JwtPayload } from './jwt';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }

}
