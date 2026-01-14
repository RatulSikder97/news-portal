
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';

@Module({
    imports: [AuthModule, UsersModule, NewsModule],
    exports: [AuthModule, UsersModule, NewsModule],
})
export class FeaturesModule { }
