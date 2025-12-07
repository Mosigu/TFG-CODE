import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectRole, hasProjectRoleOrHigher, UserRole } from '../constants/roles';

export const PROJECT_ROLES_KEY = 'projectRoles';
export const ProjectRoles = (...roles: ProjectRole[]) =>
  Reflect.metadata(PROJECT_ROLES_KEY, roles);

@Injectable()
export class ProjectRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredProjectRoles = this.reflector.getAllAndOverride<ProjectRole[]>(PROJECT_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredProjectRoles || requiredProjectRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const projectId = request.params.projectId || request.params.id;

    if (!projectId) {
      return true;
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const userProject = await this.prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: user.userId,
          projectId: projectId,
        },
      },
    });

    if (!userProject) {
      throw new ForbiddenException('You are not a member of this project');
    }

    const hasRequiredRole = requiredProjectRoles.some(requiredRole => {
      if (userProject.role === requiredRole) return true;
      if (Object.values(ProjectRole).includes(userProject.role as ProjectRole)) {
        return hasProjectRoleOrHigher(userProject.role as ProjectRole, requiredRole);
      }
      return false;
    });

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `You don't have the required project role. Required: ${requiredProjectRoles.join(', ')}`
      );
    }

    return true;
  }
}
