import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { CUSTOM_MESSAGE } from 'src/commons/decorators/message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflecor: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customMessage = this.reflecor.get(
      CUSTOM_MESSAGE,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: customMessage,
          data,
        };
      }),
    );
  }
}
