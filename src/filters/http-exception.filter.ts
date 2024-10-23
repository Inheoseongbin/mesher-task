import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus ? exception.getStatus() : 500;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message,
        };

        // Slack 메시지 전송
        await this.sendSlackMessage(errorResponse);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toLocaleString(),
            path: request.url,
            message: exception.message,
        });
    }

    private async sendSlackMessage(errorResponse: any) {
        const message = {
            text: `⚠️ *NestJS Error* \n
      Status: ${errorResponse.statusCode} \n
      Path: ${errorResponse.path} \n
      Method: ${errorResponse.method} \n
      Message: ${errorResponse.message}`,
        };

        try {
            await axios.post(this.slackWebhookUrl, message);
        } catch (error) {
            console.error('Failed to send Slack message:', error);
        }
    }
}
