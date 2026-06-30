import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CorrelationIdInterceptor } from './common/interceptors/correlation-id.interceptor';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : ['Invalid property'];
          return {
            property: error.property,
            messages: constraints,
          };
        });

        return {
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: messages,
        };
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new CorrelationIdInterceptor(), new LoggingInterceptor(app.get(LoggerService)));

  const logger = app.get(LoggerService);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Gateway running on port ${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
