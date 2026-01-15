
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { caching } from 'cache-manager';

import { AllExceptionsFilter } from './filters/http-exception.filter';
import { FileStore } from './cache/file.store';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/news-portal',
        ),
        CacheModule.register(),
    ],
    providers: [

        {
            provide: APP_INTERCEPTOR,
            useClass: HttpCacheInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: CACHE_MANAGER,
            useFactory: async () => {
                const store = new FileStore();
                return caching(store as any);
            },
        },
    ],
    exports: [ConfigModule, MongooseModule, CacheModule, CACHE_MANAGER],
})
export class CoreModule { }
