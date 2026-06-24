ÉPICA 3: API Gateway y Autenticación
HU-3.1: Validación de API Key

Como sistema externo, quiero autenticarme con mi X-Product-Key en cada request, para que el gateway valide mi identidad.

Criterios de aceptación:

 Todas las rutas protegidas requieren header X-Product-Key
 Si la API Key no existe → 401 Unauthorized
 Si el producto está inactivo → 403 Forbidden
 La API Key validada se inyecta como product_id en el request al notification-api
 Rate limiting: máximo 100 requests/minuto por API Key
HU-3.2: Enrutamiento de Peticiones

Como gateway, quiero enrutar las peticiones validadas al servicio correspondiente.

Criterios de aceptación:

 /api/notifications/* → notification-api
 /api/products/* → notification-api
 /api/channels/* → notification-api
 /api/templates/* → notification-api
 Logs de cada request con timestamp, product_id, ruta y status