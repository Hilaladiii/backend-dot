import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create')
  @Message('Success create post')
  async create(
    @GetCurrentUserId() user_id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.create({ user_id, ...createPostDto });
  }

  @Patch('update/:id')
  @Message('Succes update post')
  async update(
    @Param('id') post_id: string,
    @GetCurrentUserId() user_id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.update({
      post_id,
      user_id,
      ...updatePostDto,
    });
  }

  @Get()
  @Message('Success get user posts')
  async getUserPosts(@GetCurrentUserId() user_id: string) {
    return await this.postService.getUserPost(user_id);
  }

  @Get('following')
  async getFollowingPosts(@GetCurrentUserId() user_id: string) {
    return await this.postService.getFollowingPosts(user_id);
  }

  @Delete('delete/:id')
  @Message('Success delete your post')
  async delete(@Param('id') id: string, @GetCurrentUserId() user_id: string) {
    return await this.postService.deleteUserPost(id, user_id);
  }
}
