import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.error('Exception caught:', {
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    if (ctx.req) {
      throw exception;
    }

    const response = host.switchToHttp().getResponse();
    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message,
      timestamp: new Date().toISOString(),
    });
  }
}
