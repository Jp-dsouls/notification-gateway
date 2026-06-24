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
exports.ApiKeyGuard = exports.PRODUCT_ID_HEADER = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const gateway_exceptions_1 = require("../../common/exceptions/gateway.exceptions");
const correlation_id_middleware_1 = require("../../common/middleware/correlation-id.middleware");
exports.PRODUCT_ID_HEADER = 'x-product-id';
let ApiKeyGuard = class ApiKeyGuard {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-product-key'];
        if (!apiKey) {
            throw new gateway_exceptions_1.ApiKeyMissingException();
        }
        const correlationId = request.headers[correlation_id_middleware_1.CORRELATION_ID_HEADER];
        const notificationApiUrl = this.configService.get('NOTIFICATION_API_URL');
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${notificationApiUrl}/api/products/by-api-key/${apiKey}`, {
                headers: {
                    [correlation_id_middleware_1.CORRELATION_ID_HEADER]: correlationId,
                },
            }));
            const product = response.data;
            if (!product.status) {
                throw new gateway_exceptions_1.ProductInactiveException(product.name);
            }
            request.productId = product.id;
            request.headers[exports.PRODUCT_ID_HEADER] = product.id;
            console.log(JSON.stringify({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                service: 'gateway',
                context: 'ApiKeyGuard',
                correlationId,
                productId: product.id,
                productName: product.name,
                message: 'API Key validated successfully',
            }));
            return true;
        }
        catch (error) {
            if (error instanceof gateway_exceptions_1.ApiKeyInvalidException ||
                error instanceof gateway_exceptions_1.ProductInactiveException) {
                throw error;
            }
            throw new gateway_exceptions_1.ApiKeyInvalidException();
        }
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map