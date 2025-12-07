import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { WorkElementsService } from './work-elements.service';
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
import { JwtAuthGuard } from '../users/jwt.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, ProjectRole, hasProjectRoleOrHigher } from '../common/constants/roles';
import { PrismaService } from '../prisma/prisma.service';

@Controller('work-elements')
@UseGuards(JwtAuthGuard)
export class WorkElementsController {
  constructor(
    private readonly workElementsService: WorkElementsService,
    private readonly prisma: PrismaService,
  ) {}

  private async checkProjectAccess(
    userId: string,
    userRole: string,
    projectId: string,
    requiredProjectRole: ProjectRole,
  ): Promise<void> {
    if (userRole === UserRole.ADMIN) return;

    const userProject = await this.prisma.userProject.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!userProject) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (!hasProjectRoleOrHigher(userProject.role as ProjectRole, requiredProjectRole)) {
      throw new ForbiddenException(
        `You need at least ${requiredProjectRole} role in this project`
      );
    }
  }

  private async checkTaskAccess(
    userId: string,
    userRole: string,
    taskId: string,
    requireProjectRole?: ProjectRole,
  ): Promise<void> {
    if (userRole === UserRole.ADMIN) return;

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    const userProject = await this.prisma.userProject.findUnique({
      where: { userId_projectId: { userId, projectId: task.projectId } },
    });

    if (!userProject) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (requireProjectRole && !hasProjectRoleOrHigher(
      userProject.role as ProjectRole,
      requireProjectRole
    )) {
      const userTask = await this.prisma.userTask.findUnique({
        where: { userId_taskId: { userId, taskId } },
      });
      if (!userTask) {
        throw new ForbiddenException(
          `You need at least ${requireProjectRole} role or be assigned to this task`
        );
      }
    }
  }

  @Get('projects')
  async getAllProjects() {
    try {
      return await this.workElementsService.getAllProjects();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch projects',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('projects/:id')
  async getProjectById(@Param('id') id: string) {
    try {
      return await this.workElementsService.getProjectById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('projects')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      const result = await this.workElementsService.createProject(
        createProjectDto,
        user.userId,
      );
      return result;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('projects/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkProjectAccess(user.userId, user.role, id, ProjectRole.MANAGER);
      return await this.workElementsService.updateProject(
        id,
        updateProjectDto,
        user.userId,
      );
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      if (error.name === 'NotFoundException' || error.code === 'P2025') {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        {
          message: 'Failed to update project',
          error: error.message || 'Unknown error',
          details: error.code || error.name,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('projects/:id')
  async deleteProject(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkProjectAccess(user.userId, user.role, id, ProjectRole.OWNER);
      return await this.workElementsService.deleteProject(id, user.userId);
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      if (error.name === 'NotFoundException' || error.code === 'P2025') {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        {
          message: 'Failed to delete project',
          error: error.message || 'Unknown error',
          details: error.code || error.name,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tasks')
  async getAllTasks(@Req() req: Request) {
    try {
      const projectId = req.query.projectId as string | undefined;
      return await this.workElementsService.getAllTasks(projectId);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch tasks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tasks/:id')
  async getTaskById(@Param('id') id: string) {
    try {
      return await this.workElementsService.getTaskById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tasks')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkProjectAccess(
        user.userId,
        user.role,
        createTaskDto.projectId,
        ProjectRole.COLLABORATOR,
      );
      const result = await this.workElementsService.createTask(
        createTaskDto,
        user.userId,
      );

      return result;
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        error.message || 'Failed to create task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('tasks/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkTaskAccess(user.userId, user.role, id, ProjectRole.COLLABORATOR);
      return await this.workElementsService.updateTask(
        id,
        updateTaskDto,
        user.userId,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to update task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('tasks/:id')
  async deleteTask(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkTaskAccess(user.userId, user.role, id, ProjectRole.MANAGER);
      return await this.workElementsService.deleteTask(id, user.userId);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to delete task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('milestones')
  async getAllMilestones() {
    try {
      return await this.workElementsService.getAllMilestones();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch milestones',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('milestones/:id')
  async getMilestoneById(@Param('id') id: string) {
    try {
      return await this.workElementsService.getMilestoneById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch milestone',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('milestones')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createMilestone(
    @Body() createMilestoneDto: CreateMilestoneDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.createMilestone(
        createMilestoneDto,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to create milestone',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('milestones/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateMilestone(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.updateMilestone(
        id,
        updateMilestoneDto,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to update milestone',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('milestones/:id')
  async deleteMilestone(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.deleteMilestone(
        id,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to delete milestone',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('incidents')
  async getAllIncidences() {
    try {
      return await this.workElementsService.getAllIncidences();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch incidents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('incidents/:id')
  async getIncidenceById(@Param('id') id: string) {
    try {
      return await this.workElementsService.getIncidenceById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch incident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('incidents')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createIncidence(
    @Body() createIncidenceDto: CreateIncidenceDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.createIncidence(
        createIncidenceDto,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to create incident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('incidents/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateIncidence(
    @Param('id') id: string,
    @Body() updateIncidenceDto: UpdateIncidenceDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.updateIncidence(
        id,
        updateIncidenceDto,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to update incident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('incidents/:id')
  async deleteIncidence(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.deleteIncidence(
        id,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to delete incident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('comments')
  async getAllComments() {
    try {
      return await this.workElementsService.getAllComments();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('comments/:id')
  async getCommentById(@Param('id') id: string) {
    try {
      return await this.workElementsService.getCommentById(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('comments')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.createComment(
        createCommentDto,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to create comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('comments/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.updateComment(
        id,
        updateCommentDto,
        user.userId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to update comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('comments/:id')
  async deleteComment(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    try {
      return await this.workElementsService.deleteComment(id, user.userId);
    } catch (error) {
      throw new HttpException(
        'Failed to delete comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('projects/:projectId/users')
  async getProjectUsers(@Param('projectId') projectId: string) {
    try {
      return await this.workElementsService.getProjectUsers(projectId);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch project users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('projects/:projectId/users')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async assignUserToProject(
    @Param('projectId') projectId: string,
    @Body() createUserProjectDto: CreateUserProjectDto,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkProjectAccess(user.userId, user.role, projectId, ProjectRole.MANAGER);
      return await this.workElementsService.assignUserToProject(
        projectId,
        createUserProjectDto,
        user.userId,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to assign user to project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('projects/:projectId/users/:userId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUserProjectRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() updateUserProjectDto: UpdateUserProjectDto,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkProjectAccess(user.userId, user.role, projectId, ProjectRole.MANAGER);
      return await this.workElementsService.updateUserProjectRole(
        projectId,
        userId,
        updateUserProjectDto,
        user.userId,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to update user project role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('projects/:projectId/users/:userId')
  async removeUserFromProject(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkProjectAccess(user.userId, user.role, projectId, ProjectRole.MANAGER);
      return await this.workElementsService.removeUserFromProject(
        projectId,
        userId,
        user.userId,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to remove user from project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tasks/:taskId/users')
  async getTaskUsers(@Param('taskId') taskId: string) {
    try {
      return await this.workElementsService.getTaskUsers(taskId);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch task users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tasks/:taskId/users')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async assignUserToTask(
    @Param('taskId') taskId: string,
    @Body() createUserTaskDto: CreateUserTaskDto,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkTaskAccess(user.userId, user.role, taskId, ProjectRole.COLLABORATOR);
      return await this.workElementsService.assignUserToTask(
        taskId,
        createUserTaskDto,
        user.userId,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to assign user to task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('tasks/:taskId/users/:userId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUserTaskRole(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
    @Body() updateUserTaskDto: UpdateUserTaskDto,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkTaskAccess(user.userId, user.role, taskId, ProjectRole.COLLABORATOR);
      return await this.workElementsService.updateUserTaskRole(
        taskId,
        userId,
        updateUserTaskDto,
        user.userId,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to update user task role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('tasks/:taskId/users/:userId')
  async removeUserFromTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    try {
      await this.checkTaskAccess(user.userId, user.role, taskId, ProjectRole.COLLABORATOR);
      return await this.workElementsService.removeUserFromTask(
        taskId,
        userId,
        user.userId,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to remove user from task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
