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
import { CommentService } from './comment.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { JwtGuard } from 'src/providers/guards/jwt.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('create/:id')
  @Message('Success create comment')
  @UseGuards(JwtGuard)
  async create(
    @GetCurrentUserId() user_id: string,
    @Param('id') post_id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.create({
      user_id,
      post_id,
      ...createCommentDto,
    });
  }

  @Patch('update/:id')
  @Message('Success update comment')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') post_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.update({
      id: post_id,
      ...updateCommentDto,
    });
  }

  @Get('post/:id')
  @Message('Success get comments')
  async getPostComment(@Param('id') post_id: string) {
    return await this.commentService.getPostComment(post_id);
  }

  @Delete('delete/:id')
  @Message('Success delete comment')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string) {
    return await this.commentService.delete(id);
  }
}
