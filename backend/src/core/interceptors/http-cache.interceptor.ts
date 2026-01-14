
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, Logger, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    private readonly logger = new Logger(HttpCacheInterceptor.name);

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const key = this.trackBy(context);

        if (!key) {
            return next.handle();
        }

        try {
            const value = await this.cacheManager.get(key);
            if (value) {
                this.logger.log(`Cache HIT: Serving from cache (Key: ${key})`);
                return of(value);
            }

            this.logger.log(`Cache MISS: Direct API Call (Key: ${key})`);
            return next.handle().pipe(
                tap(async (response) => {
                    try {
                        await this.cacheManager.set(key, response);
                    } catch (err) {
                        this.logger.error(`Failed to cache key ${key}`, err);
                    }
                })
            );
        } catch (err) {
            return next.handle();
        }
    }

    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const { httpAdapter } = this.httpAdapterHost;

        const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
        const excludePaths = []; // Add paths to exclude if needed

        if (
            !isGetRequest ||
            (isGetRequest &&
                excludePaths.some((url) => httpAdapter.getRequestUrl(request).includes(url)))
        ) {
            return undefined;
        }

        const userId = request.user?._id || request.user?.id || 'public';
        return `${httpAdapter.getRequestMethod(request)}-${httpAdapter.getRequestUrl(request)}-${userId}`;
    }
}
