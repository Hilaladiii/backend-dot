import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from '../../providers/guards/jwt.guard';
import { GetCurrentUserId } from '../../commons/decorators/get-current-user-id.decorator';
import { Message } from '../../commons/decorators/message.decorator';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create')
  @Message('Success create post')
  @UseGuards(JwtGuard)
  async create(
    @GetCurrentUserId() user_id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.create({ user_id, ...createPostDto });
  }

  @Patch('update/:id')
  @Message('Succes update post')
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  async getUserPosts(@GetCurrentUserId() user_id: string) {
    return await this.postService.getUserPost(user_id);
  }

  @Get('following')
  @UseGuards(JwtGuard)
  async getFollowingPosts(@GetCurrentUserId() user_id: string) {
    return await this.postService.getFollowingPosts(user_id);
  }

  @Delete('delete/:id')
  @Message('Success delete your post')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string, @GetCurrentUserId() user_id: string) {
    return await this.postService.deleteUserPost(id, user_id);
  }
}
