import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import {
  ApiKeyMissingException,
  ApiKeyInvalidException,
  ProductInactiveException,
} from '../../common/exceptions/gateway.exceptions';
import { CORRELATION_ID_HEADER } from '../../common/middleware/correlation-id.middleware';
import { LoggerService } from '../../logger/logger.service';

export const PRODUCT_ID_HEADER = 'x-product-id';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-product-key'] as string;

    if (!apiKey) {
      throw new ApiKeyMissingException();
    }

    const correlationId = request.headers[CORRELATION_ID_HEADER] as string;
    const notificationApiUrl = this.configService.get<string>('NOTIFICATION_API_URL');

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${notificationApiUrl}/api/products/by-api-key/${apiKey}`,
          {
            headers: {
              [CORRELATION_ID_HEADER]: correlationId,
            },
          },
        ),
      );

      const product = response.data;

      if (!product.status) {
        throw new ProductInactiveException(product.name);
      }

      (request as Request & { productId: string }).productId = product.id;
      request.headers[PRODUCT_ID_HEADER] = product.id;

      const maskedKey = apiKey ? `${apiKey.substring(0, 8)}...` : 'N/A';
      this.logger.log(
        `API Key validated: ${maskedKey} | product: ${product.name} (${product.id})`,
        correlationId,
      );

      return true;
    } catch (error) {
      if (
        error instanceof ApiKeyInvalidException ||
        error instanceof ProductInactiveException
      ) {
        throw error;
      }

      throw new ApiKeyInvalidException();
    }
  }
}
