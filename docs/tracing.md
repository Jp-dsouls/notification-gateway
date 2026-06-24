# Trazabilidad - Gateway

## Visión General

El gateway es el **punto de entrada principal** del sistema. Aquí se genera o recibe el **Correlation ID** que permite rastrear una operación completa a través de todos los microservicios.

## Flujo de Trazabilidad

```
┌─────────     ┌──────────┐     ┌──────────────────┐     ┌───────────────┐
│ Cliente │────▶│ Gateway  │────▶│ notification-api │────▶│ channel-worker│
└─────────┘     └──────────┘     └──────────────────┘     └───────────────┘
       │                │                    │                        │
       │   X-Correlation-ID: abc-123        │                        │
       │────────────────────────────────────────────────────────────▶│
       │                                                             │
       │                    Todos los logs incluyen                  │
       │                    este correlation ID                      │
       │                                                             │
       ▼                                                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        MongoDB (Logs)                                   │
│  { correlationId: "abc-123", service: "gateway", ... }                 │
│  { correlationId: "abc-123", service: "notification-api", ... }        │
│  { correlationId: "abc-123", service: "channel-worker", ... }          │
─────────────────────────────────────────────────────────────────────────┘
```

## Generación del Correlation ID

### Opción 1: Cliente lo proporciona

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "X-Product-Key: abc-123" \
  -H "X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{ "templateId": "tmpl-456" }'
```

El gateway usa el correlation ID proporcionado.

### Opción 2: Gateway lo genera

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "X-Product-Key: abc-123" \
  -d '{ "templateId": "tmpl-456" }'
```

El gateway genera un UUID v4 y lo incluye en la respuesta:

```
Response Headers:
  X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
```

## Implementación

### Middleware de Correlation ID

```typescript
// src/common/middleware/correlation-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let correlationId = req.headers[CORRELATION_ID_HEADER] as string;

    if (!correlationId) {
      correlationId = uuidv4();
    }

    (req as Request & { correlationId: string }).correlationId = correlationId;
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
```

### Guard de API Key

```typescript
// src/auth/guards/api-key.guard.ts
@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-product-key'] as string;

    if (!apiKey) {
      throw new ApiKeyMissingException();
    }

    const correlationId = request.headers[CORRELATION_ID_HEADER] as string;

    // Valida la API Key contra notification-api
    const response = await firstValueFrom(
      this.httpService.get(
        `${notificationApiUrl}/api/products/by-api-key/${apiKey}`,
        {
          headers: {
            [CORRELATION_ID_HEADER]: correlationId,
          },
        },
      ),
    );

    const product = response.data;

    if (!product.status) {
      throw new ProductInactiveException(product.name);
    }

    // Inyecta product_id en el request
    request.productId = product.id;
    request.headers['x-product-id'] = product.id;

    return true;
  }
}
```

### Proxy Service

```typescript
// src/proxy/proxy.service.ts
@Injectable()
export class ProxyService {
  async proxyRequest(
    method: string,
    path: string,
    request: Request,
    correlationId: string,
  ) {
    const notificationApiUrl = this.configService.get<string>('NOTIFICATION_API_URL');
    const targetUrl = `${notificationApiUrl}/api${path}`;

    const headers = {
      [CORRELATION_ID_HEADER]: correlationId,
      'X-Product-ID': request.productId,
      'Content-Type': 'application/json',
    };

    const response = await firstValueFrom(
      this.httpService.request({
        method,
        url: targetUrl,
        data: request.body,
        params: request.query,
        headers,
        timeout: 30000,
      }),
    );

    return { status: response.status, data: response.data };
  }
}
```

## Logs Estructurados

### Log de Validación Exitosa

```json
{
  "timestamp": "2026-06-22T10:30:00.000Z",
  "level": "INFO",
  "service": "gateway",
  "context": "ApiKeyGuard",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "prod-123",
  "productName": "E-commerce",
  "message": "API Key validated successfully"
}
```

### Log de Proxy

```json
{
  "timestamp": "2026-06-22T10:30:00.000Z",
  "level": "INFO",
  "service": "gateway",
  "context": "ProxyService.proxyRequest",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "targetUrl": "http://localhost:3001/api/notifications/send",
  "statusCode": 202,
  "message": "Request proxied successfully"
}
```

### Log de Error

```json
{
  "timestamp": "2026-06-22T10:30:00.000Z",
  "level": "ERROR",
  "service": "gateway",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "url": "/api/notifications/send",
  "statusCode": 401,
  "message": "X-Product-Key header is required"
}
```

## Campos del Log

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `timestamp` | ISO 8601 | Fecha y hora del evento |
| `level` | string | INFO, ERROR, WARN, DEBUG |
| `service` | string | Nombre del microservicio (gateway) |
| `context` | string | Clase/método que genera el log |
| `correlationId` | UUID | ID de trazabilidad |
| `productId` | UUID | ID del producto (si aplica) |
| `productName` | string | Nombre del producto (si aplica) |
| `method` | string | Método HTTP (GET, POST, etc.) |
| `targetUrl` | string | URL del servicio downstream |
| `statusCode` | number | Código HTTP de respuesta |
| `message` | string | Descripción del evento |

## Consultas de Trazabilidad

### Buscar por Correlation ID

```bash
# Todos los logs del gateway para una operación
grep "550e8400-e29b-41d4-a716-446655440000" logs/gateway.json

# Con jq para formato legible
grep "550e8400-e29b-41d4-a716-446655440000" logs/gateway.json | jq .
```

### Buscar por Product ID

```bash
# Todos los logs de un producto específico
grep '"productId": "prod-123"' logs/gateway.json
```

### Buscar por Método HTTP

```bash
# Todos los POST requests
grep '"method": "POST"' logs/gateway.json
```

## Herramientas de Producción

### Kibana / Elasticsearch

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "service": "gateway" } },
        { "match": { "correlationId": "550e8400-e29b-41d4-a716-446655440000" } }
      ]
    }
  }
}
```

### Datadog

```
service:gateway correlationId:550e8400-e29b-41d4-a716-446655440000
```

### Grafana Loki

```
{service="gateway"} |~ "550e8400-e29b-41d4-a716-446655440000"
```

## Diferencia entre IDs

| ID | Scope | Ejemplo de Uso |
|----|-------|----------------|
| `correlationId` | Flujo completo | Trazar operación de inicio a fin |
| `productId` | Producto | Identificar qué producto hace el request |
| `notificationId` | Notificación | Identificar notificación específica |

### Ejemplo de Relación

```json
{
  "correlationId": "abc-123",
  "productId": "prod-789",
  "notificationId": "notif-456"
}
```

- **correlationId**: Sigue el flujo completo (gateway → api → worker → DB)
- **productId**: Indica qué producto envió la solicitud
- **notificationId**: Identifica esta notificación específica (generado en notification-api)

## Mejores Prácticas

1. **Siempre incluir correlationId** en todos los logs
2. **Generar early** - Lo antes posible en el flujo (gateway)
3. **Propagar siempre** - Pasarlo a cada servicio downstream
4. **Logs estructurados** - Usar JSON para facilitar consultas
5. **Rate limiting** - Proteger contra abuso (100 req/min)
6. **Timeouts** - Configurar timeouts apropiados (30s)
7. **Circuit breaker** - Considerar para producción
8. **Headers estándar** - Usar `X-Correlation-ID` consistentemente

## Ejemplo de Flujo Completo

### 1. Cliente envía request

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "X-Product-Key: abc-123" \
  -d '{ "templateId": "tmpl-456", "destination": "user@example.com" }'
```

### 2. Gateway genera correlation ID

```
X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
```

### 3. Gateway valida API Key

```json
{
  "timestamp": "2026-06-22T10:30:00.000Z",
  "level": "INFO",
  "service": "gateway",
  "context": "ApiKeyGuard",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "prod-123",
  "message": "API Key validated successfully"
}
```

### 4. Gateway hace proxy a notification-api

```json
{
  "timestamp": "2026-06-22T10:30:00.000Z",
  "level": "INFO",
  "service": "gateway",
  "context": "ProxyService.proxyRequest",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "targetUrl": "http://localhost:3001/api/notifications/send",
  "statusCode": 202,
  "message": "Request proxied successfully"
}
```

### 5. notification-api procesa y encola

```json
{
  "timestamp": "2026-06-22T10:30:00.000Z",
  "level": "INFO",
  "service": "notification-api",
  "context": "NotificationsService.send",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "notificationId": "660e8400-e29b-41d4-a716-446655440001",
  "message": "Notification queued"
}
```

### 6. channel-worker consume y envía

```json
{
  "timestamp": "2026-06-22T10:30:01.000Z",
  "level": "INFO",
  "service": "channel-worker",
  "context": "EmailService.send",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "notificationId": "660e8400-e29b-41d4-a716-446655440001",
  "message": "Email sent successfully"
}
```

### 7. Buscar todos los logs de esta operación

```bash
grep "550e8400-e29b-41d4-a716-446655440000" logs/*.json
```

Resultado: Verás los 4 logs arriba, mostrando el flujo completo.
