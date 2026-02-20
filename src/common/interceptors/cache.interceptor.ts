import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly TTL = 60000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { query, variables } = request.body || {};

    if (request.method !== 'POST' || !query || query.includes('mutation')) {
      return next.handle();
    }

    const cacheKey = `${query}:${JSON.stringify(variables)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + this.TTL,
        });
      }),
    );
  }
}
