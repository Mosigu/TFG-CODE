import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityService } from 'src/activity/activity.service';
import { Project, Task, Milestone, Incidence, Comment } from '@prisma/client';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { CreateIncidenceDto } from './dto/create-incidence.dto';
import { UpdateIncidenceDto } from './dto/update-incidence.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateUserProjectDto } from './dto/create-user-project.dto';
import { UpdateUserProjectDto } from './dto/update-user-project.dto';
import { CreateUserTaskDto } from './dto/create-user-task.dto';
import { UpdateUserTaskDto } from './dto/update-user-task.dto';

@Injectable()
export class WorkElementsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async getAllProjects(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        users: { include: { user: true } },
        tasks: true,
      },
    } as any);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.prisma.project.create({
      data: createProjectDto,
    } as any);

    try {
      await this.activityService.logProjectCreated(
        userId,
        project.id,
        project.title,
      );
    } catch (activityError) {
      console.error(
        'Failed to log activity, but project was created:',
        activityError,
      );
    }

    return project;
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    try {
      console.log('Service: Updating project', id);
      console.log('Service: Update data', updateProjectDto);

      // Verify that the project exists
      await this.getProjectById(id);

      console.log('Service: Project found, updating...');
      const project = await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
        include: {
          users: { include: { user: true } },
          tasks: true,
        },
      } as any);

      console.log('Service: Project updated, logging activity...');
      try {
        await this.activityService.logProjectUpdated(
          userId,
          project.id,
          project.title,
          JSON.stringify(updateProjectDto),
        );
      } catch (activityError) {
        console.error(
          'Failed to log activity, but project was updated:',
          activityError,
        );
      }

      console.log('Service: Update completed successfully');
      return project;
    } catch (error: any) {
      console.error('Error in updateProject service:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  async deleteProject(id: string, userId: string): Promise<Project> {
    try {
      const project = await this.getProjectById(id);

      console.log('Deleting project:', id);

      console.log('Deleting user-project relations...');
      await this.prisma.userProject.deleteMany({
        where: { projectId: id },
      });

      console.log('Finding tasks...');
      const tasks = await this.prisma.task.findMany({
        where: { projectId: id },
      });

      console.log(`Found ${tasks.length} tasks to delete`);

      for (const task of tasks) {
        console.log(`Processing task ${task.id}...`);

        // Delete user-task relations
        await this.prisma.userTask.deleteMany({
          where: { taskId: task.id },
        });

        // Delete comments
        await this.prisma.comment.deleteMany({
          where: { taskId: task.id },
        });

        // Delete incidences
        await this.prisma.incidence.deleteMany({
          where: { taskId: task.id },
        });

        // Delete milestones
        await this.prisma.milestone.deleteMany({
          where: { taskId: task.id },
        });
      }

      // Delete all tasks
      console.log('Deleting tasks...');
      await this.prisma.task.deleteMany({
        where: { projectId: id },
      });

      // Delete the project
      console.log('Deleting project...');
      const deleted = await this.prisma.project.delete({
        where: { id },
      });

      // Log activity
      console.log('Logging activity...');
      try {
        await this.activityService.logProjectDeleted(
          userId,
          deleted.id,
          deleted.title,
        );
      } catch (activityError) {
        console.error(
          'Failed to log activity, but project was deleted:',
          activityError,
        );
      }

      console.log('Project deleted successfully');
      return deleted;
    } catch (error: any) {
      console.error('Error in deleteProject service:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  async getAllTasks(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: {
        project: true,
        createdBy: true,
        milestones: true,
        incidences: true,
        users: { include: { user: true } },
        comments: { include: { author: true } },
      },
    } as any);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        createdBy: true,
        milestones: true,
        incidences: true,
        users: { include: { user: true } },
        comments: { include: { author: true } },
      },
    } as any);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        createdById: userId,
        status: 'pending',
      },
      include: {
        project: true,
        createdBy: true,
        milestones: true,
        incidences: true,
        users: { include: { user: true } },
        comments: { include: { author: true } },
      },
    });

    try {
      await this.activityService.logTaskCreated(
        userId,
        task.id,
        task.title,
        task.projectId,
      );
    } catch (activityError) {
      console.error(
        'Failed to log activity, but task was created:',
        activityError,
      );
    }

    return task;
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const oldTask = await this.getTaskById(id);
    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        project: true,
        createdBy: true,
        milestones: true,
        incidences: true,
        users: { include: { user: true } },
        comments: { include: { author: true } },
      },
    } as any);

    if (oldTask.status !== task.status) {
      await this.activityService.logTaskStatusChanged(
        userId,
        task.id,
        task.title,
        oldTask.status,
        task.status,
      );
    } else {
      await this.activityService.logTaskUpdated(
        userId,
        task.id,
        task.title,
        JSON.stringify(updateTaskDto),
      );
    }

    return task;
  }

  async deleteTask(id: string, userId: string): Promise<Task> {
    const task = await this.getTaskById(id);
    const deleted = await this.prisma.task.delete({ where: { id } });

    await this.activityService.logTaskDeleted(
      userId,
      deleted.id,
      deleted.title,
    );

    return deleted;
  }

  async getAllMilestones(): Promise<Milestone[]> {
    return this.prisma.milestone.findMany({
      include: { task: true },
    } as any);
  }

  async getMilestoneById(id: string): Promise<Milestone> {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: { task: true },
    } as any);
    if (!milestone) throw new NotFoundException('Milestone not found');
    return milestone;
  }

  async createMilestone(
    createMilestoneDto: CreateMilestoneDto,
    userId: string,
  ): Promise<Milestone> {
    const milestone = await this.prisma.milestone.create({
      data: createMilestoneDto,
      include: { task: true },
    } as any);

    const task = await this.getTaskById(milestone.taskId);
    await this.activityService.logMilestoneCompleted(
      userId,
      milestone.id,
      milestone.title,
      task.id,
      task.title,
    );

    return milestone;
  }

  async updateMilestone(
    id: string,
    updateMilestoneDto: UpdateMilestoneDto,
    userId: string,
  ): Promise<Milestone> {
    await this.getMilestoneById(id);
    const milestone = await this.prisma.milestone.update({
      where: { id },
      data: updateMilestoneDto,
      include: { task: true },
    } as any);

    if (updateMilestoneDto.isCompleted) {
      const task = await this.getTaskById(milestone.taskId);
      await this.activityService.logMilestoneCompleted(
        userId,
        milestone.id,
        milestone.title,
        task.id,
        task.title,
      );
    }

    return milestone;
  }

  async deleteMilestone(id: string, userId: string): Promise<Milestone> {
    await this.getMilestoneById(id);
    return this.prisma.milestone.delete({ where: { id } } as any);
  }

  async getAllIncidences(): Promise<Incidence[]> {
    return this.prisma.incidence.findMany() as any;
  }

  async getIncidenceById(id: string): Promise<Incidence> {
    const incidence = await this.prisma.incidence.findUnique({
      where: { id },
    } as any);
    if (!incidence) throw new NotFoundException('Incidence not found');
    return incidence;
  }

  async createIncidence(
    createIncidenceDto: CreateIncidenceDto,
    userId: string,
  ): Promise<Incidence> {
    const incidence = await this.prisma.incidence.create({
      data: createIncidenceDto as any,
    } as any);

    const task = await this.getTaskById((incidence as any).taskId);
    await this.activityService.logIncidenceCreated(
      userId,
      incidence.id,
      incidence.title,
      task.id,
      task.title,
    );

    return incidence;
  }

  async updateIncidence(
    id: string,
    updateIncidenceDto: UpdateIncidenceDto,
    userId: string,
  ): Promise<Incidence> {
    const oldIncidence = await this.getIncidenceById(id);
    const incidence = await this.prisma.incidence.update({
      where: { id },
      data: updateIncidenceDto as any,
    } as any);

    if (incidence.status === 'resolved' && oldIncidence.status !== 'resolved') {
      const task = await this.getTaskById((incidence as any).taskId);
      await this.activityService.logIncidenceResolved(
        userId,
        incidence.id,
        incidence.title,
        task.id,
        task.title,
      );
    }

    return incidence;
  }

  async deleteIncidence(id: string, userId: string): Promise<Incidence> {
    await this.getIncidenceById(id);
    return this.prisma.incidence.delete({ where: { id } } as any);
  }

  async getAllComments(): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      include: { author: true },
    } as any);
  }

  async getCommentById(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { author: true },
    } as any);
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: createCommentDto,
      include: { author: true },
    } as any);

    if ((comment as any).taskId) {
      const task = await this.getTaskById((comment as any).taskId);
      await this.activityService.logCommentCreated(
        userId,
        comment.id,
        task.id,
        task.title,
      );
    }

    return comment;
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    await this.getCommentById(id);
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: { author: true },
    } as any);
  }

  async deleteComment(id: string, userId: string): Promise<Comment> {
    await this.getCommentById(id);
    return this.prisma.comment.delete({ where: { id } } as any);
  }

  async getProjectUsers(projectId: string) {
    await this.getProjectById(projectId);
    return this.prisma.userProject.findMany({
      where: { projectId },
      include: { user: true },
    });
  }

  async assignUserToProject(
    projectId: string,
    createUserProjectDto: CreateUserProjectDto,
    userId: string,
  ) {
    const project = await this.getProjectById(projectId);

    const result = await this.prisma.userProject.create({
      data: {
        projectId,
        userId: createUserProjectDto.userId,
        role: createUserProjectDto.role,
      },
      include: { user: true, project: true },
    } as any);

    await this.activityService.logUserAssignedToProject(
      userId,
      project.id,
      project.title,
      (result as any).user.id,
      `${(result as any).user.name} ${(result as any).user.surname}`,
      result.role,
    );

    return result;
  }

  async updateUserProjectRole(
    projectId: string,
    userId: string,
    updateUserProjectDto: UpdateUserProjectDto,
    currentUserId: string,
  ) {
    const project = await this.getProjectById(projectId);
    const userProject = await this.prisma.userProject.findUnique({
      where: { userId_projectId: { userId, projectId } },
      include: { user: true },
    });

    const result = await this.prisma.userProject.update({
      where: { userId_projectId: { userId, projectId } },
      data: updateUserProjectDto as any,
      include: { user: true, project: true },
    });

    return result;
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
    currentUserId: string,
  ) {
    const project = await this.getProjectById(projectId);
    const userProject = await this.prisma.userProject.findUnique({
      where: { userId_projectId: { userId, projectId } },
      include: { user: true },
    });

    await this.prisma.userProject.delete({
      where: { userId_projectId: { userId, projectId } },
    });

    if (userProject) {
      await this.activityService.logUserRemovedFromProject(
        currentUserId,
        project.id,
        project.title,
        userProject.user.id,
        `${userProject.user.name} ${userProject.user.surname}`,
      );
    }

    return userProject;
  }

  async getTaskUsers(taskId: string) {
    await this.getTaskById(taskId);
    return this.prisma.userTask.findMany({
      where: { taskId },
      include: { user: true },
    });
  }

  async assignUserToTask(
    taskId: string,
    createUserTaskDto: CreateUserTaskDto,
    userId: string,
  ) {
    const task = await this.getTaskById(taskId);

    const result = await this.prisma.userTask.create({
      data: {
        taskId,
        userId: createUserTaskDto.userId,
        role: createUserTaskDto.role,
      },
      include: { user: true, task: true },
    } as any);

    await this.activityService.logUserAssignedToTask(
      userId,
      task.id,
      task.title,
      (result as any).user.id,
      `${(result as any).user.name} ${(result as any).user.surname}`,
      (result as any).role,
    );

    return result;
  }

  async updateUserTaskRole(
    taskId: string,
    userId: string,
    updateUserTaskDto: UpdateUserTaskDto,
    currentUserId: string,
  ) {
    const task = await this.getTaskById(taskId);

    const result = await this.prisma.userTask.update({
      where: { userId_taskId: { userId, taskId } },
      data: updateUserTaskDto as any,
      include: { user: true, task: true },
    });

    return result;
  }

  async removeUserFromTask(
    taskId: string,
    userId: string,
    currentUserId: string,
  ) {
    const task = await this.getTaskById(taskId);
    const userTask = await this.prisma.userTask.findUnique({
      where: { userId_taskId: { userId, taskId } },
      include: { user: true },
    });

    await this.prisma.userTask.delete({
      where: { userId_taskId: { userId, taskId } },
    });

    if (userTask) {
      await this.activityService.logUserRemovedFromTask(
        currentUserId,
        task.id,
        task.title,
        userTask.user.id,
        `${userTask.user.name} ${userTask.user.surname}`,
      );
    }

    return userTask;
  }
}
