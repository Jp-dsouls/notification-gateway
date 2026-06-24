"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const correlation_id_interceptor_1 = require("./common/interceptors/correlation-id.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
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
}
bootstrap();
//# sourceMappingURL=main.js.map