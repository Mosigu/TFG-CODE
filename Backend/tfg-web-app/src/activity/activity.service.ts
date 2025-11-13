import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Event } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async getAllActivities(filters: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    limit: number;
  }): Promise<Event[]> {
    const where: any = {};

    if (filters.userId) where.agentId = filters.userId;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;

    return this.prisma.event.findMany({
      where,
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
      take: filters.limit,
    } as any);
  }

  async getUserActivities(
    userId: string,
    limit: number = 50,
  ): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { agentId: userId },
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    } as any);
  }

  async getEntityActivities(
    entityType: string,
    entityId: string,
    limit: number = 50,
  ): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        entityType,
        entityId,
      },
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    } as any);
  }

  async getActivityById(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { agent: true },
    } as any);

    if (!event) throw new NotFoundException('Activity not found');
    return event;
  }

  async createActivity(createActivityDto: CreateActivityDto): Promise<Event> {
    return this.prisma.event.create({
      data: createActivityDto,
      include: { agent: true },
    } as any);
  }

  async deleteActivity(id: string): Promise<Event> {
    await this.getActivityById(id);
    return this.prisma.event.delete({ where: { id } } as any);
  }

  async logProjectCreated(
    userId: string,
    projectId: string,
    projectTitle: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'project',
      entityId: projectId,
      action: 'CREATED',
      description: `Created project "${projectTitle}"`,
    });
  }

  async logProjectUpdated(
    userId: string,
    projectId: string,
    projectTitle: string,
    changes: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'project',
      entityId: projectId,
      action: 'UPDATED',
      description: `Updated project "${projectTitle}": ${changes}`,
    });
  }

  async logProjectDeleted(
    userId: string,
    projectId: string,
    projectTitle: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'project',
      entityId: projectId,
      action: 'DELETED',
      description: `Deleted project "${projectTitle}"`,
    });
  }

  async logTaskCreated(
    userId: string,
    taskId: string,
    taskTitle: string,
    projectId: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'task',
      entityId: taskId,
      action: 'CREATED',
      description: `Created task "${taskTitle}"`,
      relatedEntityId: projectId,
      relatedEntityType: 'project',
    });
  }

  async logTaskUpdated(
    userId: string,
    taskId: string,
    taskTitle: string,
    changes: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'task',
      entityId: taskId,
      action: 'UPDATED',
      description: `Updated task "${taskTitle}": ${changes}`,
    });
  }

  async logTaskDeleted(userId: string, taskId: string, taskTitle: string) {
    return this.createActivity({
      agentId: userId,
      entityType: 'task',
      entityId: taskId,
      action: 'DELETED',
      description: `Deleted task "${taskTitle}"`,
    });
  }

  async logTaskStatusChanged(
    userId: string,
    taskId: string,
    taskTitle: string,
    oldStatus: string,
    newStatus: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'task',
      entityId: taskId,
      action: 'STATUS_CHANGED',
      description: `Changed status of "${taskTitle}" from "${oldStatus}" to "${newStatus}"`,
    });
  }

  async logUserAssignedToProject(
    userId: string,
    projectId: string,
    projectTitle: string,
    assignedUserId: string,
    assignedUserName: string,
    role: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'project',
      entityId: projectId,
      action: 'USER_ASSIGNED',
      description: `Assigned ${assignedUserName} as ${role} in project "${projectTitle}"`,
      relatedEntityId: assignedUserId,
      relatedEntityType: 'user',
    });
  }

  async logUserRemovedFromProject(
    userId: string,
    projectId: string,
    projectTitle: string,
    removedUserId: string,
    removedUserName: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'project',
      entityId: projectId,
      action: 'USER_REMOVED',
      description: `Removed ${removedUserName} from project "${projectTitle}"`,
      relatedEntityId: removedUserId,
      relatedEntityType: 'user',
    });
  }

  async logUserAssignedToTask(
    userId: string,
    taskId: string,
    taskTitle: string,
    assignedUserId: string,
    assignedUserName: string,
    role?: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'task',
      entityId: taskId,
      action: 'USER_ASSIGNED',
      description: `Assigned ${assignedUserName}${role ? ` as ${role}` : ''} in task "${taskTitle}"`,
      relatedEntityId: assignedUserId,
      relatedEntityType: 'user',
    });
  }

  async logUserRemovedFromTask(
    userId: string,
    taskId: string,
    taskTitle: string,
    removedUserId: string,
    removedUserName: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'task',
      entityId: taskId,
      action: 'USER_REMOVED',
      description: `Removed ${removedUserName} from task "${taskTitle}"`,
      relatedEntityId: removedUserId,
      relatedEntityType: 'user',
    });
  }

  async logCommentCreated(
    userId: string,
    commentId: string,
    taskId: string,
    taskTitle: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'comment',
      entityId: commentId,
      action: 'CREATED',
      description: `Commented on task "${taskTitle}"`,
      relatedEntityId: taskId,
      relatedEntityType: 'task',
    });
  }

  async logMilestoneCompleted(
    userId: string,
    milestoneId: string,
    milestoneName: string,
    taskId: string,
    taskTitle: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'milestone',
      entityId: milestoneId,
      action: 'COMPLETED',
      description: `Completed milestone "${milestoneName}" in task "${taskTitle}"`,
      relatedEntityId: taskId,
      relatedEntityType: 'task',
    });
  }

  async logIncidenceCreated(
    userId: string,
    incidenceId: string,
    incidenceTitle: string,
    taskId: string,
    taskTitle: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'incidence',
      entityId: incidenceId,
      action: 'CREATED',
      description: `Reported incidence "${incidenceTitle}" in task "${taskTitle}"`,
      relatedEntityId: taskId,
      relatedEntityType: 'task',
    });
  }

  async logIncidenceResolved(
    userId: string,
    incidenceId: string,
    incidenceTitle: string,
    taskId: string,
    taskTitle: string,
  ) {
    return this.createActivity({
      agentId: userId,
      entityType: 'incidence',
      entityId: incidenceId,
      action: 'RESOLVED',
      description: `Resolved incidence "${incidenceTitle}" in task "${taskTitle}"`,
      relatedEntityId: taskId,
      relatedEntityType: 'task',
    });
  }
}
