import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from '../user/user.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async create({
    user_id,
    content,
  }: CreatePostDto & { user_id: string }): Promise<{
    content: string;
    created_at: Date;
  }> {
    const user = await this.userService.getById(user_id);

    if (!user)
      throw new NotFoundException("User not found, can't create a post!");

    return await this.prismaService.post.create({
      data: {
        content,
        user: {
          connect: {
            id: user_id,
          },
        },
      },
      select: {
        content: true,
        created_at: true,
      },
    });
  }

  async getPostById(id: string): Promise<Post> {
    return await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
  }

  async update({
    content,
    user_id,
    post_id,
  }: UpdatePostDto & { user_id: string; post_id: string }): Promise<{
    id: string;
    content: string;
  }> {
    const user = await this.userService.getById(user_id);

    if (!user)
      throw new NotFoundException("User not found, can't update post!");

    const post = await this.prismaService.post.findUnique({
      where: {
        id: post_id,
      },
    });

    if (!post)
      throw new NotFoundException("Post not found, can't update post!");

    content = content ?? post.content;
    return await this.prismaService.post.update({
      where: {
        id: post.id,
      },
      data: {
        content,
      },
      select: {
        id: true,
        content: true,
      },
    });
  }

  async getUserPost(user_id: string): Promise<Post[]> {
    const user = await this.userService.getById(user_id);
    if (!user)
      throw new NotFoundException(
        'User not found in our system, please register first!',
      );
    return await this.prismaService.post.findMany({
      where: {
        user_id,
      },
      include: {
        comments: true,
      },
    });
  }

  async getFollowingPosts(id: string) {
    const user = await this.userService.getById(id);
    if (!user)
      throw new NotFoundException(
        'User not found in our system, please register first!',
      );
    const posts = await this.prismaService.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              user_id: user.id,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        comments: {
          select: {
            content: true,
            created_at: true,
            id: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!posts || posts.length <= 0)
      throw new NotFoundException(
        'Post not available, please follow other user to get posts',
      );
    return posts;
  }

  async deleteUserPost(post_id: string, user_id: string) {
    const user = await this.userService.getById(user_id);

    if (!user)
      throw new NotFoundException("User not found, can't delete post!");
    const post = await this.getPostById(post_id);
    if (!post) throw new NotFoundException('Post not found!');

    return await this.prismaService.post.delete({
      where: {
        id: post_id,
      },
    });
  }
}
