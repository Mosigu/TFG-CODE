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
  HttpException,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from '../common/constants/roles';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.usersService.validateUser(
        body.email,
        body.password,
      );
      if (!user)
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      return this.usersService.login(user);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getAllUsers() {
    try {
      return await this.usersService.getAllUsers();
    } catch {
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    try {
      return await this.usersService.getUserById(id);
    } catch {
      throw new HttpException(
        'Failed to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { userId: string; email: string; role: string },
  ) {
    try {
      const isAdmin = currentUser.role === UserRole.ADMIN;
      const isSelf = currentUser.userId === id;

      if (!isAdmin && !isSelf) {
        throw new ForbiddenException('You can only update your own profile');
      }

      if (!isAdmin && isSelf) {
        if (updateUserDto.role !== undefined) {
          throw new ForbiddenException('You cannot change your own role');
        }
        if (updateUserDto.managerId !== undefined) {
          throw new ForbiddenException('You cannot change your own manager');
        }
      }

      return await this.usersService.updateUser(id, updateUserDto);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.usersService.deleteUser(id);
    } catch {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
