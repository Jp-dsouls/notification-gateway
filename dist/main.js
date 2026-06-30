"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const correlation_id_interceptor_1 = require("./common/interceptors/correlation-id.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Gateway')
        .setDescription('Gateway for routing and authenticating notification API requests')
        .setVersion('1.0')
        .addTag('proxy', 'Proxy routes to notification-api')
        .addApiKey({ type: 'apiKey', name: 'X-Product-Key', in: 'header' }, 'product-key')
        .addApiKey({ type: 'apiKey', name: 'X-Correlation-ID', in: 'header' }, 'correlation-id')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
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
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new correlation_id_interceptor_1.CorrelationIdInterceptor());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Gateway running on port ${port}`);
    console.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map