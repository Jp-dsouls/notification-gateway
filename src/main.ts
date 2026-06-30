import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CorrelationIdInterceptor } from './common/interceptors/correlation-id.interceptor';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:80'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Product-Key', 'X-Correlation-ID'],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
      exceptionFactory: (errors) => {
        const messages =
          process.env.NODE_ENV === 'production'
            ? 'Validation failed'
            : errors.map((error) => ({
                property: error.property,
                messages: Object.values(error.constraints || {}),
              }));

        return {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: messages,
        };
      },
    }),
  );

  const logger = app.get(LoggerService);
  const port = process.env.PORT || 3000;

  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalInterceptors(new CorrelationIdInterceptor(), new LoggingInterceptor(logger));

  if (process.env.ENABLE_SWAGGER !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('API Gateway')
      .setDescription('Gateway for routing and authenticating notification API requests')
      .setVersion('1.0')
      .addTag('proxy', 'Proxy routes to notification-api')
      .addApiKey({ type: 'apiKey', name: 'X-Product-Key', in: 'header' }, 'product-key')
      .addApiKey({ type: 'apiKey', name: 'X-Correlation-ID', in: 'header' }, 'correlation-id')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    logger.log(`Swagger docs: http://localhost:${port}/docs`);
  }

  await app.listen(port);
  logger.log(`Gateway running on port ${port}`);
}

bootstrap();
