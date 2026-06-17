import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status: number = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException
            ? (exception.getResponse() as any).message || exception.message
            : 'Internal Server Error!';

        // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        //     console.error('======= SYSTEM ERROR LOG =======');
        //     console.error(exception);
        //     console.error('================================');
        // }

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}