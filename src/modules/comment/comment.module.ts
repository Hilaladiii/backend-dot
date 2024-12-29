import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PostModule } from '../post/post.module';
import { CommentController } from './comment.controller';

@Module({
  imports: [PostModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
