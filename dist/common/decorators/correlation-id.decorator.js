"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationId = void 0;
const common_1 = require("@nestjs/common");
const correlation_id_middleware_1 = require("../middleware/correlation-id.middleware");
exports.CorrelationId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.correlationId ||
        request.headers[correlation_id_middleware_1.CORRELATION_ID_HEADER] ||
        'N/A');
});
//# sourceMappingURL=correlation-id.decorator.js.map