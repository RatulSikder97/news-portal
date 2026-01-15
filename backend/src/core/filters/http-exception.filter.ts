
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        const message =
            typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
                ? (exceptionResponse as any).message
                : exceptionResponse;

        // Determine errors payload
        let errors = {};
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            errors = exceptionResponse;
        }

        response.status(status).json({
            status: false,
            statusCode: status,
            msg: Array.isArray(message) ? message[0] : message, // Use first error message if array
            data: {},
            errors: errors,
        });
    }
}
