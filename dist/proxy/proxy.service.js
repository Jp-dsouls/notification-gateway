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
exports.ProxyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const gateway_exceptions_1 = require("../common/exceptions/gateway.exceptions");
const correlation_id_middleware_1 = require("../common/middleware/correlation-id.middleware");
const api_key_guard_1 = require("../auth/guards/api-key.guard");
let ProxyService = class ProxyService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async proxyRequest(method, path, request, correlationId) {
        const notificationApiUrl = this.configService.get('NOTIFICATION_API_URL');
        const targetUrl = `${notificationApiUrl}/api${path}`;
        const headers = {
            [correlation_id_middleware_1.CORRELATION_ID_HEADER]: correlationId,
            'Content-Type': 'application/json',
        };
        const productId = request.productId;
        if (productId) {
            headers[api_key_guard_1.PRODUCT_ID_HEADER] = productId;
        }
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            service: 'gateway',
            context: 'ProxyService.proxyRequest',
            correlationId,
            method,
            targetUrl,
            message: 'Proxying request to notification-api',
        }));
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                method: method,
                url: targetUrl,
                data: request.body,
                params: request.query,
                headers,
                timeout: 30000,
            }));
            console.log(JSON.stringify({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                service: 'gateway',
                context: 'ProxyService.proxyRequest',
                correlationId,
                method,
                targetUrl,
                statusCode: response.status,
                message: 'Request proxied successfully',
            }));
            return {
                status: response.status,
                data: response.data,
            };
        }
        catch (error) {
            if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                throw new gateway_exceptions_1.GatewayTimeoutException('notification-api');
            }
            if (error.response) {
                return {
                    status: error.response.status,
                    data: error.response.data,
                };
            }
            throw new gateway_exceptions_1.ServiceUnavailableException('notification-api');
        }
    }
};
exports.ProxyService = ProxyService;
exports.ProxyService = ProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ProxyService);
//# sourceMappingURL=proxy.service.js.map