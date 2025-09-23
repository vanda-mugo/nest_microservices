import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices/decorators/message-pattern.decorator';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';

@Controller('user')
export class UserController {
  @MessagePattern('get_user')
  getUser(@Payload() userId: number) {
    console.log('Received user ID:', userId);
    return { message: 'User data retrieved successfully', userId };
  }
}
