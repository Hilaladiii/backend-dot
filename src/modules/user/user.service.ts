import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { TUserProfile } from 'src/commons/types/user.type';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create({
    email,
    username,
    password,
  }: CreateUserDto): Promise<{ username: string; email: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user)
      throw new BadRequestException('email already used by another account!');

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        username: true,
        email: true,
      },
    });
  }

  async getAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async getById(id: string): Promise<TUserProfile> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        email: true,
        username: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    const { _count, ...rest } = user;
    return {
      ...rest,
      followers: _count.followers,
      following: _count.following,
    };
  }

  async update({
    id,
    username,
    password,
  }: UpdateUserDto & { id: string }): Promise<{
    username: string;
    email: string;
  }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found, Update failed!');

    username = username ?? user.username;
    password = password ? await bcrypt.hash(password, 10) : user.password;

    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        username,
        password,
      },
      select: {
        email: true,
        username: true,
      },
    });
  }

  async remove(id: string): Promise<{ username: string; email: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user)
      throw new NotFoundException('User not found, Delete account failed!');

    return await this.prismaService.user.delete({
      where: {
        id,
      },
      select: {
        email: true,
        username: true,
      },
    });
  }
}
