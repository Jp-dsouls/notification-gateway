import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get('liveness')
  @ApiResponse({ status: 200, description: 'Service is alive' })
  liveness() {
    return {
      status: 'ok',
      service: process.env.SERVICE_NAME || 'gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('readiness')
  @ApiResponse({ status: 200, description: 'Service is ready' })
  readiness() {
    return {
      status: 'ok',
      service: process.env.SERVICE_NAME || 'gateway',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check() {
    return {
      status: 'ok',
      service: process.env.SERVICE_NAME || 'gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
