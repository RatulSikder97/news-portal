
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    status: boolean;
    statusCode: number;
    msg: string;
    data: T;
    errors: any;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                status: true,
                statusCode: context.switchToHttp().getResponse().statusCode,
                msg: 'Success',
                data: data,
                errors: {},
            })),
        );
    }
}
