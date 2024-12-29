import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from 'src/providers/guards/jwt.guard';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';
import { Message } from 'src/commons/decorators/message.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

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
    return await this.userService.getById(user_id);
  }

  @Put('update')
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
}
