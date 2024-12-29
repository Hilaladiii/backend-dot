import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModule } from '../user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/providers/guards/jwt.guard';

@Module({
  imports: [UserModule],
  providers: [
    PostService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  controllers: [PostController],
})
export class PostModule {}
