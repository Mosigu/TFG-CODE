import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole, hasRoleOrHigher } from '../constants/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    let userRole = user.role;

    if (!userRole) {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { role: true },
      });

      if (!dbUser) {
        throw new ForbiddenException('User not found');
      }
      userRole = dbUser.role;
    }

    const hasRole = requiredRoles.some(requiredRole => {
      if (userRole === requiredRole) return true;
      if (Object.values(UserRole).includes(userRole as UserRole) &&
          Object.values(UserRole).includes(requiredRole as UserRole)) {
        return hasRoleOrHigher(userRole as UserRole, requiredRole as UserRole);
      }
      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException(`You don't have permission to access this resource. Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
