import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new UnauthorizedException('No token provided');
        const token = String(authHeader).split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; name: string; role: string };
            req.user = { userId: decoded.userId, role: decoded.role };
            return true;
        } catch {
            throw new ForbiddenException('Invalid or Expire Token');
        }
    }
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly roles: string[] = []) {}
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        if (!req.user) throw new UnauthorizedException();
        if (this.roles.length === 0) return true;
        return this.roles.includes(req.user.role);
    }
}


