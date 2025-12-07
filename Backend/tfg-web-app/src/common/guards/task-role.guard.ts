import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole, ProjectRole, hasProjectRoleOrHigher } from '../constants/roles';

export const TASK_ACCESS_KEY = 'taskAccess';

export enum TaskAccessLevel {
  ASSIGNED = 'assigned',
  PROJECT_MEMBER = 'project_member',
  PROJECT_COLLABORATOR = 'project_collaborator',
  PROJECT_MANAGER = 'project_manager',
}

export const TaskAccess = (...levels: TaskAccessLevel[]) =>
  Reflect.metadata(TASK_ACCESS_KEY, levels);

@Injectable()
export class TaskRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccess = this.reflector.getAllAndOverride<TaskAccessLevel[]>(TASK_ACCESS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredAccess || requiredAccess.length === 0) {
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

    const taskId = request.params.taskId || request.params.id;

    if (!taskId) {
      return true;
    }

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const userTask = await this.prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: user.userId,
          taskId: taskId,
        },
      },
    });

    const userProject = await this.prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: user.userId,
          projectId: task.projectId,
        },
      },
    });

    for (const accessLevel of requiredAccess) {
      switch (accessLevel) {
        case TaskAccessLevel.ASSIGNED:
          if (userTask) return true;
          break;
        case TaskAccessLevel.PROJECT_MEMBER:
          if (userProject) return true;
          break;
        case TaskAccessLevel.PROJECT_COLLABORATOR:
          if (userProject && hasProjectRoleOrHigher(
            userProject.role as ProjectRole,
            ProjectRole.COLLABORATOR
          )) return true;
          break;
        case TaskAccessLevel.PROJECT_MANAGER:
          if (userProject && hasProjectRoleOrHigher(
            userProject.role as ProjectRole,
            ProjectRole.MANAGER
          )) return true;
          break;
      }
    }

    throw new ForbiddenException(
      'You do not have access to this task'
    );
  }
}
