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
import { ProxyService } from './proxy.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CorrelationId } from '../common/decorators/correlation-id.decorator';

@Controller()
@UseGuards(ApiKeyGuard)
@Throttle({ default: { ttl: 60000, limit: 100 } })
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('products/*path')
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
