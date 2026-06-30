"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const correlation_id_middleware_1 = require("../common/middleware/correlation-id.middleware");
const logger_service_1 = require("../logger/logger.service");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const correlationId = request.headers[correlation_id_middleware_1.CORRELATION_ID_HEADER];
        const className = context.getClass().name;
        const methodName = context.getHandler().name;
        this.loggerService.setContext(`${className}.${methodName}`);
        this.loggerService.log(`${request.method} ${request.url}`, correlationId);
        return next.handle();
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map