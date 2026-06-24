# Manejo de Errores y Trazabilidad - Gateway

## Códigos HTTP Utilizados

### Éxito (2xx)

| Código | Uso | Ejemplo |
|--------|-----|---------|
| 200 OK | Consultas exitosas | GET /api/products, GET /api/channels |
| 201 Created | Creación de recursos | POST /api/products, POST /api/channels |
| 202 Accepted | Notificación encolada | POST /api/notifications/send |

### Errores del Cliente (4xx)

| Código | Excepción | Cuándo se usa |
|--------|-----------|---------------|
| 400 Bad Request | - | Datos de entrada inválidos (de notification-api) |
| 401 Unauthorized | `ApiKeyMissingException` | Header `X-Product-Key` no proporcionado |
| 401 Unauthorized | `ApiKeyInvalidException` | API Key no existe en la base de datos |
| 403 Forbidden | `ProductInactiveException` | Producto existe pero está inactivo |
| 404 Not Found | - | Recurso no encontrado (de notification-api) |
| 409 Conflict | - | Nombre duplicado (de notification-api) |
| 422 Unprocessable Entity | - | Validación fallida (de notification-api) |
| 429 Too Many Requests | `@Throttle()` | Rate limiting: >100 requests/minuto |

### Errores del Servidor (5xx)

| Código | Excepción | Cuándo se usa |
|--------|-----------|---------------|
| 500 Internal Server Error | - | Errores inesperados |
| 502 Bad Gateway | - | notification-api retorna respuesta inválida |
| 503 Service Unavailable | `ServiceUnavailableException` | notification-api no responde |
| 504 Gateway Timeout | `GatewayTimeoutException` | notification-api tarda >30 segundos |

---

## Formato de Respuesta de Error

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "X-Product-Key header is required",
  "timestamp": "2026-06-22T10:30:00.000Z",
  "path": "/api/products",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Trazabilidad con Correlation ID

### Generación del Correlation ID

El gateway es el **primer punto de entrada** del sistema. Aquí se genera el correlation ID si el cliente no lo proporciona.

```typescript
// Middleware del gateway
let correlationId = req.headers['x-correlation-id'] as string;

if (!correlationId) {
  correlationId = uuidv4(); // Genera uno nuevo
}

// Lo propaga a todos los servicios downstream
request.correlationId = correlationId;
res.setHeader('X-Correlation-ID', correlationId);
```

### Propagación del Correlation ID

```
Cliente → Gateway → notification-api → RabbitMQ → channel-worker
         │           │                              │
         └─ X-Correlation-ID: abc-123 ──────────────┘
```

1. **Cliente** puede enviar `X-Correlation-ID` (opcional)
2. **Gateway** genera el UUID si no viene
3. **Gateway** lo pasa a `notification-api` en cada request
4. **notification-api** lo incluye en el mensaje de RabbitMQ
5. **channel-worker** lo recibe y lo usa en logs

### Headers HTTP

| Header | Dirección | Descripción |
|--------|-----------|-------------|
| `X-Correlation-ID` | Entrada/Salida | UUID de trazabilidad |
| `X-Product-Key` | Entrada | API Key del producto |
| `X-Product-ID` | Interna | ID del producto (inyectado por guard) |

---

## Excepciones Personalizadas

### Autenticación

| Excepción | Código | Descripción |
|-----------|--------|-------------|
| `ApiKeyMissingException` | 401 | Header `X-Product-Key` no proporcionado |
| `ApiKeyInvalidException` | 401 | API Key no existe en la base de datos |
| `ProductInactiveException` | 403 | Producto existe pero está inactivo |

### Proxy

| Excepción | Código | Descripción |
|-----------|--------|-------------|
| `ServiceUnavailableException` | 503 | notification-api no responde |
| `GatewayTimeoutException` | 504 | notification-api tarda >30 segundos |

---

## Rate Limiting

### Configuración

```typescript
// app.module.ts
ThrottlerModule.forRoot([
  {
    ttl: 60000, // 60 segundos
    limit: 100, // 100 requests
  },
]);
```

### Respuesta 429

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "ThrottlerException: Too Many Requests",
  "timestamp": "2026-06-22T10:30:00.000Z",
  "path": "/api/products",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Flujo de Validación

### 1. Recepción de Request

```
POST /api/notifications/send
Headers:
  X-Product-Key: abc-123
  X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000 (opcional)
```

### 2. Middleware de Correlation ID

```typescript
// Si no viene X-Correlation-ID, se genera uno nuevo
const correlationId = req.headers['x-correlation-id'] || uuidv4();
request.correlationId = correlationId;
```

### 3. Guard de API Key

```typescript
// Valida X-Product-Key
const apiKey = req.headers['x-product-key'];
if (!apiKey) throw new ApiKeyMissingException();

// Consulta notification-api para validar
const product = await httpService.get(`/api/products/by-api-key/${apiKey}`);
if (!product) throw new ApiKeyInvalidException();
if (!product.status) throw new ProductInactiveException(product.name);

// Inyecta product_id en el request
request.productId = product.id;
```

### 4. Proxy a notification-api

```typescript
// Forward del request con headers
const response = await httpService.request({
  method: 'POST',
  url: `${NOTIFICATION_API_URL}/api/notifications/send`,
  headers: {
    'X-Correlation-ID': correlationId,
    'X-Product-ID': productId,
  },
  data: req.body,
});
```

### 5. Respuesta al Cliente

```json
{
  "notificationId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "queued",
  "channel": "email",
  "destination": "user@example.com",
  "timestamp": "2026-06-22T10:30:00.000Z"
}
```

Header de respuesta: `X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000`

---

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

---

## Implementación Técnica

### Middleware de Correlation ID

```typescript
// src/common/middleware/correlation-id.middleware.ts
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let correlationId = req.headers['x-correlation-id'] as string;

    if (!correlationId) {
      correlationId = uuidv4();
    }

    (req as Request & { correlationId: string }).correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

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
    const notificationApiUrl = this.configService.get<string>('NOTIFICATION_API_URL');

    try {
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

      request.productId = product.id;
      request.headers['x-product-id'] = product.id;

      return true;
    } catch (error) {
      if (error instanceof ApiKeyInvalidException || 
          error instanceof ProductInactiveException) {
        throw error;
      }

      throw new ApiKeyInvalidException();
    }
  }
}
```

### Proxy Service

```typescript
// src/proxy/proxy.service.ts
@Injectable()
export class ProxyService {
  async proxyRequest(method: string, path: string, request: Request, correlationId: string) {
    const notificationApiUrl = this.configService.get<string>('NOTIFICATION_API_URL');
    const targetUrl = `${notificationApiUrl}/api${path}`;

    const headers = {
      [CORRELATION_ID_HEADER]: correlationId,
      'X-Product-ID': request.productId,
      'Content-Type': 'application/json',
    };

    try {
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
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new GatewayTimeoutException('notification-api');
      }

      if (error.response) {
        return { status: error.response.status, data: error.response.data };
      }

      throw new ServiceUnavailableException('notification-api');
    }
  }
}
```

---

## Ejemplos de Uso

### Request Exitoso

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "X-Product-Key: abc-123" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "tmpl-456",
    "destination": "user@example.com",
    "variables": { "name": "John", "company": "Acme" }
  }'
```

Respuesta:
```json
{
  "notificationId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "queued",
  "channel": "email",
  "destination": "user@example.com",
  "timestamp": "2026-06-22T10:30:00.000Z"
}
```

Header: `X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000`

### Request sin API Key

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{ "templateId": "tmpl-456" }'
```

Respuesta:
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "X-Product-Key header is required",
  "timestamp": "2026-06-22T10:30:00.000Z",
  "path": "/api/notifications/send",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Request con API Key Inválida

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "X-Product-Key: invalid-key" \
  -H "Content-Type: application/json" \
  -d '{ "templateId": "tmpl-456" }'
```

Respuesta:
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid API Key",
  "timestamp": "2026-06-22T10:30:00.000Z",
  "path": "/api/notifications/send",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Consultas de Trazabilidad

### Buscar logs por Correlation ID

```bash
# En gateway
grep "550e8400-e29b-41d4-a716-446655440000" logs/gateway.json

# En notification-api
grep "550e8400-e29b-41d4-a716-446655440000" logs/notification-api.json

# En channel-worker
grep "550e8400-e29b-41d4-a716-446655440000" logs/channel-worker.json
```

### Flujo completo de una operación

```
1. [Gateway] "API Key validated successfully" - correlationId: abc-123
2. [Gateway] "Proxying request to notification-api" - correlationId: abc-123
3. [notification-api] "Notification queued" - correlationId: abc-123
4. [channel-worker] "Email sent successfully" - correlationId: abc-123
```

---

## Mejores Prácticas

1. **Siempre incluir correlationId** en todos los logs
2. **Generar early** - Lo antes posible en el flujo (gateway)
3. **Propagar siempre** - Pasarlo a cada servicio downstream
4. **Logs estructurados** - Usar JSON para facilitar consultas
5. **Rate limiting** - Proteger contra abuso (100 req/min)
6. **Timeouts** - Configurar timeouts apropiados (30s)
7. **Circuit breaker** - Considerar para producción
