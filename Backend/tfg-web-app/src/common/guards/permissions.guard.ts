import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole, RolePermissions, canPerformAction } from '../constants/roles';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<(keyof RolePermissions)[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    let userRole = user.role as UserRole;

    if (!userRole) {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { role: true },
      });

      if (!dbUser) {
        throw new ForbiddenException('User not found');
      }
      userRole = dbUser.role as UserRole;
    }

    const hasAllPermissions = requiredPermissions.every(permission =>
      canPerformAction(userRole, permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `You don't have the required permissions: ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }
}
