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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
const proxy_service_1 = require("./proxy.service");
const api_key_guard_1 = require("../auth/guards/api-key.guard");
const correlation_id_decorator_1 = require("../common/decorators/correlation-id.decorator");
let ProxyController = class ProxyController {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    async getProducts(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('GET', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async createProduct(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('POST', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async updateProduct(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('PUT', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async getChannels(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('GET', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async createChannel(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('POST', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async updateChannel(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('PUT', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async getTemplates(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('GET', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async createTemplate(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('POST', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async updateTemplate(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('PUT', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async deleteTemplate(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('DELETE', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async getNotifications(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('GET', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
    async sendNotification(req, res, correlationId) {
        const result = await this.proxyService.proxyRequest('POST', req.path, req, correlationId);
        res.status(result.status).json(result.data);
    }
};
exports.ProxyController = ProxyController;
__decorate([
    (0, common_1.Get)('products/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy GET requests to products endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy POST requests to products endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)('products/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy PUT requests to products endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Get)('channels/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy GET requests to channels endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Channels data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getChannels", null);
__decorate([
    (0, common_1.Post)('channels'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy POST requests to channels endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Channel created' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Put)('channels/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy PUT requests to channels endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Channel updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "updateChannel", null);
__decorate([
    (0, common_1.Get)('templates/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy GET requests to templates endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Templates data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy POST requests to templates endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Put)('templates/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy PUT requests to templates endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy DELETE requests to templates endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template deleted' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Get)('notifications/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy GET requests to notifications endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notifications data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Post)('notifications/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a notification (enqueue for processing)' }),
    (0, swagger_1.ApiResponse)({ status: 202, description: 'Notification queued successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or missing API key' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Template does not belong to product' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "sendNotification", null);
exports.ProxyController = ProxyController = __decorate([
    (0, swagger_1.ApiTags)('proxy'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, throttler_1.Throttle)({ default: { ttl: 60000, limit: 100 } }),
    (0, swagger_1.ApiHeader)({ name: 'X-Product-Key', description: 'API Key for product authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'X-Correlation-ID', description: 'Tracing correlation ID', required: false }),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], ProxyController);
//# sourceMappingURL=proxy.controller.js.map