import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Req,
  Param,
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

  @Get('products*')
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

  @Put('products*')
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

  @Get('channels*')
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

  @Put('channels*')
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

  @Get('templates*')
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

  @Put('templates*')
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

  @Delete('templates*')
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

  @Get('notifications*')
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

  @Post('notifications*')
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
