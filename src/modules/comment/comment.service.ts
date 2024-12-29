import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from '../post/dto/create-post.dto';
import { PostService } from '../post/post.service';
import { Comment } from '@prisma/client';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private prismaService: PrismaService,
    private postService: PostService,
  ) {}

  async create({
    user_id,
    post_id,
    content,
  }: CreatePostDto & { user_id: string; post_id: string }): Promise<Comment> {
    const post = await this.postService.getPostById(post_id);
    if (!post) throw new NotFoundException('Post not found!');

    return await this.prismaService.comment.create({
      data: {
        content,
        post: {
          connect: {
            id: post_id,
          },
        },
        user: {
          connect: {
            id: user_id,
          },
        },
      },
    });
  }

  async update({
    content,
    id,
  }: UpdateCommentDto & { id: string }): Promise<Comment> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Comment not found!');
    return await this.prismaService.comment.update({
      data: {
        content,
      },
      where: {
        id,
      },
    });
  }

  async getPostComment(post_id: string): Promise<Comment[]> {
    const post = await this.postService.getPostById(post_id);
    if (!post) throw new NotFoundException('Post not found');

    return await this.prismaService.comment.findMany({
      where: {
        post_id,
      },
    });
  }

  async delete(id: string): Promise<Comment> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Comment not found!');

    return await this.prismaService.comment.delete({
      where: {
        id,
      },
    });
  }
}
