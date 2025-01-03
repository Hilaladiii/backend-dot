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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../../providers/guards/jwt.guard';
import { GetCurrentUserId } from '../../commons/decorators/get-current-user-id.decorator';
import { Message } from '../../commons/decorators/message.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @Message('Success register your account')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('profile')
  @Message('Success get your profile')
  @UseGuards(JwtGuard)
  async getProfile(@GetCurrentUserId() user_id: string) {
    return await this.userService.getUserProfile(user_id);
  }

  @Patch('update')
  @Message('Success update your profile')
  @UseGuards(JwtGuard)
  async updateProfile(
    @GetCurrentUserId() user_id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update({
      id: user_id,
      ...updateUserDto,
    });
  }

  @Post('follow/:id')
  @Message('Success follow user')
  @UseGuards(JwtGuard)
  async follow(
    @GetCurrentUserId() user_id: string,
    @Param('id') follow_user_id: string,
  ) {
    return await this.userService.followUser(user_id, follow_user_id);
  }

  @Delete('unfollow/:id')
  @Message('Success unfollow user')
  @UseGuards(JwtGuard)
  async unFollow(
    @GetCurrentUserId() user_id: string,
    @Param('id') follow_user_id: string,
  ) {
    return await this.userService.unFollowUser(user_id, follow_user_id);
  }

  @Get('followers')
  @Message('Success get followers')
  @UseGuards(JwtGuard)
  async getFollowers(@GetCurrentUserId() user_id: string) {
    return await this.userService.getFollowers(user_id);
  }

  @Get('following')
  @Message('Success get following')
  @UseGuards(JwtGuard)
  async getFollowing(@GetCurrentUserId() user_id: string) {
    return await this.userService.getFollowing(user_id);
  }
}
