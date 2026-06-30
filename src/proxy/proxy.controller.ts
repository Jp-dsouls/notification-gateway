import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CorrelationId } from '../common/decorators/correlation-id.decorator';

@ApiTags('proxy')
@Controller()
@UseGuards(ApiKeyGuard)
@Throttle({ default: { ttl: 60000, limit: 100 } })
@ApiHeader({ name: 'X-Product-Key', description: 'API Key for product authentication', required: true })
@ApiHeader({ name: 'X-Correlation-ID', description: 'Tracing correlation ID', required: false })
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('products/*path')
  @ApiOperation({ summary: 'Proxy GET requests to products endpoint' })
  @ApiResponse({ status: 200, description: 'Products data' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async getProducts(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'GET',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Post('products')
  @ApiOperation({ summary: 'Proxy POST requests to products endpoint' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async createProduct(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'POST',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Put('products/*path')
  @ApiOperation({ summary: 'Proxy PUT requests to products endpoint' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async updateProduct(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'PUT',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Get('channels/*path')
  @ApiOperation({ summary: 'Proxy GET requests to channels endpoint' })
  @ApiResponse({ status: 200, description: 'Channels data' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async getChannels(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'GET',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Post('channels')
  @ApiOperation({ summary: 'Proxy POST requests to channels endpoint' })
  @ApiResponse({ status: 201, description: 'Channel created' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async createChannel(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'POST',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Put('channels/*path')
  @ApiOperation({ summary: 'Proxy PUT requests to channels endpoint' })
  @ApiResponse({ status: 200, description: 'Channel updated' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async updateChannel(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'PUT',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Get('templates/*path')
  @ApiOperation({ summary: 'Proxy GET requests to templates endpoint' })
  @ApiResponse({ status: 200, description: 'Templates data' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async getTemplates(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'GET',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Proxy POST requests to templates endpoint' })
  @ApiResponse({ status: 201, description: 'Template created' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async createTemplate(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'POST',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Put('templates/*path')
  @ApiOperation({ summary: 'Proxy PUT requests to templates endpoint' })
  @ApiResponse({ status: 200, description: 'Template updated' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async updateTemplate(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'PUT',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Delete('templates/*path')
  @ApiOperation({ summary: 'Proxy DELETE requests to templates endpoint' })
  @ApiResponse({ status: 200, description: 'Template deleted' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async deleteTemplate(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'DELETE',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Get('notifications/*path')
  @ApiOperation({ summary: 'Proxy GET requests to notifications endpoint' })
  @ApiResponse({ status: 200, description: 'Notifications data' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async getNotifications(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'GET',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }

  @Post('notifications/send')
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @ApiOperation({ summary: 'Send a notification (enqueue for processing)' })
  @ApiResponse({ status: 202, description: 'Notification queued successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  @ApiResponse({ status: 403, description: 'Template does not belong to product' })
  async sendNotification(
    @Req() req: Request,
    @Res() res: Response,
    @CorrelationId() correlationId: string,
  ) {
    const result = await this.proxyService.proxyRequest(
      'POST',
      req.path,
      req,
      correlationId,
    );
    res.status(result.status).json(result.data);
  }
}
