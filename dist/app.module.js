"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const axios_1 = require("@nestjs/axios");
const common_module_1 = require("./common/common.module");
const proxy_module_1 = require("./proxy/proxy.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: Number(process.env.THROTTLE_TTL) || 60,
                    limit: Number(process.env.THROTTLE_LIMIT) || 100,
                },
            ]),
            axios_1.HttpModule.register({
                timeout: 30000,
                maxRedirects: 5,
            }),
            common_module_1.CommonModule,
            proxy_module_1.ProxyModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map