import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // -----------------------
  // CRUD Users
  // -----------------------
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        profilePictureURL: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        profilePictureURL: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const result = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        surname: createUserDto.surname,
        role: createUserDto.role || 'contributor',
        profilePictureURL: createUserDto.profilePictureURL,
        managerId: createUserDto.managerId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        profilePictureURL: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return result;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const data: any = {};

    if (updateUserDto.email !== undefined) data.email = updateUserDto.email;
    if (updateUserDto.name !== undefined) data.name = updateUserDto.name;
    if (updateUserDto.surname !== undefined)
      data.surname = updateUserDto.surname;
    if (updateUserDto.role !== undefined) data.role = updateUserDto.role;
    if (updateUserDto.profilePictureURL !== undefined)
      data.profilePictureURL = updateUserDto.profilePictureURL;
    if (updateUserDto.managerId !== undefined) {
      data.manager = updateUserDto.managerId
        ? { connect: { id: updateUserDto.managerId } }
        : { disconnect: true };
    }
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        profilePictureURL: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string): Promise<Omit<User, 'password'>> {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        profilePictureURL: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // -----------------------
  // AUTH METHODS
  // -----------------------
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload), user };
  }
}
