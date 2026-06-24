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
    (0, common_1.Get)('products*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)('products*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Get)('channels*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getChannels", null);
__decorate([
    (0, common_1.Post)('channels'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Put)('channels*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "updateChannel", null);
__decorate([
    (0, common_1.Get)('templates*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Put)('templates*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Get)('notifications*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Post)('notifications*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, correlation_id_decorator_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "sendNotification", null);
exports.ProxyController = ProxyController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, throttler_1.Throttle)({ default: { ttl: 60000, limit: 100 } }),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], ProxyController);
//# sourceMappingURL=proxy.controller.js.map