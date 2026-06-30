import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import {
  ServiceUnavailableException,
  GatewayTimeoutException,
} from '../common/exceptions/gateway.exceptions';
import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id.middleware';
import { PRODUCT_ID_HEADER } from '../auth/guards/api-key.guard';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async proxyRequest(
    method: string,
    path: string,
    request: Request,
    correlationId: string,
  ) {
    const notificationApiUrl = this.configService.get<string>('NOTIFICATION_API_URL');
    // Remove /api prefix from path since notification-api already has it as global prefix
    const cleanPath = path.replace(/^\/api/, '');
    const targetUrl = `${notificationApiUrl}/api${cleanPath}`;

    const headers: Record<string, string> = {
      [CORRELATION_ID_HEADER]: correlationId,
      'Content-Type': 'application/json',
    };

    const productId = (request as Request & { productId?: string }).productId;
    if (productId) {
      headers[PRODUCT_ID_HEADER] = productId;
    }

    this.logger.log(`Proxying ${method} ${targetUrl}`, correlationId);

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: method as any,
          url: targetUrl,
          data: request.body,
          params: request.query,
          headers,
          timeout: 30000,
        }),
      );

      this.logger.log(`Proxied ${method} ${targetUrl} → ${response.status}`, correlationId);

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new GatewayTimeoutException('notification-api');
      }

      if (error.response) {
        return {
          status: error.response.status,
          data: error.response.data,
        };
      }

      throw new ServiceUnavailableException('notification-api');
    }
  }
}
