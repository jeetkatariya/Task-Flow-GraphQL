import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    
    if (ctx && ctx.req) {
      if (!ctx.req.ip && ctx.req.connection) {
        ctx.req.ip = ctx.req.connection.remoteAddress;
      }
      if (!ctx.req.headers && ctx.req.getHeaders) {
        ctx.req.headers = ctx.req.getHeaders();
      }
      return { req: ctx.req, res: ctx.res || ctx.req.res };
    }
    
    return super.getRequestResponse(context);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    if (!req) {
      return 'unknown';
    }
    const ip = req.ip || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress ||
               req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
               req.headers?.['x-real-ip'] ||
               'unknown';
    return ip;
  }
}
