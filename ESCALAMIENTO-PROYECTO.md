# Investigación: cómo escalar Mesa Criolla

**Fecha de consulta:** 27 de septiembre de 2026  
**Estado del proyecto revisado:** MVP de landing estática en HTML, CSS y JavaScript; hoy el formulario prepara una consulta y abre WhatsApp. No hay cuentas, API, persistencia propia de pedidos ni cobro en línea.

## Resumen ejecutivo

Para evolucionar sin rehacer el producto entero, la ruta más simple para este proyecto es:

1. Mantener la landing como presentación pública y añadir una pequeña aplicación de reservas.
2. Usar **Supabase Auth con Google** para iniciar sesión, **Postgres** para clientes y pedidos, y **Row Level Security (RLS)** para que cada usuario acceda solo a sus propios datos.
3. Añadir funciones de servidor (por ejemplo, Supabase Edge Functions) para crear reservas confirmadas, iniciar pagos y recibir webhooks. El navegador nunca debe decidir si un pago fue aprobado ni contener secretos privados.
4. Empezar los pagos con **Mercado Pago Checkout Pro**: se paga en el entorno de Mercado Pago y luego se vuelve al sitio. Confirmar el estado real mediante webhook consultado/verificado por el servidor. Evaluar Culqi como alternativa local y comparar condiciones comerciales vigentes antes de contratar.
5. Implementar por etapas y mantener WhatsApp como canal de ayuda durante la transición.

La cuenta no debería ser requisito para leer el menú o preguntar. Conviene pedir login cuando el cliente vaya a guardar/ver sus reservas; si se permite una solicitud sin cuenta, se puede invitar luego a reclamarla mediante enlace de acceso enviado al correo.

## Estado actual y consecuencias

Los archivos `index.html`, `styles.css` y `script.js` forman una web estática sin un proceso servidor. El JavaScript construye un mensaje con distrito, cantidad de personas, platos y fecha tentativa; lo pasa a WhatsApp. Estos datos no se guardan en una base propia. Por lo tanto, añadir un botón “Ingresar con Google” por sí solo no crea un backend de pedidos: hace falta definir API, almacenamiento, reglas de acceso, estados del pedido y operación administrativa.

No hace falta migrar inmediatamente a React o Next.js. Supabase ofrece cliente JavaScript para una aplicación web pequeña. Si luego aparecen paneles complejos, gestión de disponibilidad, notificaciones o varias integraciones, sería razonable separar un frontend de aplicación (por ejemplo, Vite/React o Next.js) y un backend con endpoints protegidos. La decisión depende de la complejidad y el hosting definitivo.

## Arquitectura recomendada

```text
Sitio público (landing + menú)
        │ HTTPS
        ├── Supabase Auth: Google OAuth y sesión
        ├── Postgres: perfiles, reservas y pagos
        │      └── RLS: cada cliente ve sus propios registros
        └── Funciones de servidor
               ├── Crear/actualizar pedido con validaciones
               ├── Crear sesión u orden de pago
               └── Webhook del proveedor → verificar evento → actualizar pago/pedido
```

**Por qué Supabase para este caso:** el negocio tiene relaciones naturales (usuario, pedido, platos, pagos), por lo que una base SQL facilita informes y consultas administrativas. Google OAuth está documentado y se configura en Google Cloud y Supabase. Supabase permite mantener el frontend ligero y aplicar reglas de base por usuario. No se debe publicar la clave `service_role` en el navegador: solo la clave pública/anon diseñada para uso cliente, con RLS correctamente habilitado.

**Alternativa válida:** Firebase Authentication con Google y Cloud Firestore puede ser rápido si se prioriza una integración Google/NoSQL y tiempo real. Requiere diseñar cuidadosamente las reglas de Firestore y el modelo documental. Para reportes y consultas de pedidos relacionados, Postgres suele ser más directo. No conviene operar ambos proveedores de identidad/base de datos al comienzo.

## Datos que convendría almacenar

Diseño inicial, deliberadamente pequeño:

- **profiles**: `id` (igual al usuario autenticado), nombre visible, correo, teléfono opcional, fecha de creación. No pedir más datos que los necesarios.
- **orders**: `id`, `user_id`, distrito, dirección solo cuando sea necesaria para una reserva confirmada, comensales, fecha solicitada, fecha acordada, estado, notas, precio acordado en PEN, consentimiento/fecha de aceptación y marcas de tiempo.
- **order_items**: `order_id`, plato, porciones y observaciones. Guardar una copia del nombre/precio acordados si el menú o precio puede cambiar.
- **payments**: `order_id`, proveedor, identificador externo, monto en céntimos o decimal controlado, moneda `PEN`, estado, fecha de pago/reembolso. No almacenar datos de tarjeta ni CVV.
- **audit_events** (opcional al inicio): cambios administrativos de estado y actor, útil para resolver discrepancias.

Estados sugeridos del pedido: `requested` → `quoted` → `awaiting_customer` → `confirmed` → `completed`; además `cancelled`. Estados del pago separados: `not_required`, `pending`, `approved`, `rejected`, `refunded`, `chargeback`. Un pago no debe convertir por sí solo una solicitud sin revisar en una reserva confirmada.

## Recorrido recomendado para la persona cliente

1. Ve menú, cobertura y condiciones sin registrarse.
2. Envía una solicitud sencilla; la operación confirma zona, disponibilidad, porciones y precio.
3. Cuando el servicio tenga fecha y precio confirmados, crea una cuenta con Google o inicia sesión para consultar su reserva. Alternativamente, se puede reservar primero como invitado y enviar un enlace seguro de acceso al correo.
4. Si se acuerda un adelanto, el backend crea la orden de pago por el importe confirmado y redirige al checkout.
5. El proveedor notifica al backend. El backend valida el webhook/consulta la operación y cambia el pago. El usuario ve una pantalla de resultado, pero el retorno del navegador no cuenta como prueba de pago.
6. El cliente consulta sus reservas y recibe confirmación por correo/WhatsApp. La operación mantiene una bandeja sencilla para revisar solicitudes, cotizar, confirmar o cancelar.

**Decisión comercial pendiente:** el MVP plantea una coordinación manual y todavía no fija precio, adelanto, cancelaciones ni capacidad. Primero medir demanda y acordar política de reservas; implementar pago online tiene sentido cuando haya un precio y un proceso de confirmación estables.

## Pagos en Perú: opciones encontradas

### Mercado Pago Checkout Pro — recomendación inicial para evaluar

Checkout Pro redirige a un checkout alojado por Mercado Pago, lo que reduce el manejo directo de datos de tarjeta en la web propia. Su documentación para Perú describe tarjetas, cuenta de Mercado Pago y Yape, sujeto a disponibilidad/configuración de la cuenta. Para una integración nueva, la documentación actual recomienda Orders API; crea la orden en servidor, usa idempotencia por intento, redirige a `checkout_url` y procesa notificaciones webhook. Debe hacerse una compra de prueba antes de producción.

**Ventajas:** integración de checkout alojado, retorno al sitio y webhooks documentados; menos superficie propia de pagos que un formulario totalmente personalizado.  
**A verificar:** requisitos de cuenta de vendedor/RUC, medios habilitados para esta cuenta, comisión y plazo de abono actuales, reembolsos, contracargos y documentación tributaria.

### Culqi — alternativa local para comparar

Culqi ofrece checkout integrable con tarjetas, Yape, PagoEfectivo y otros medios según producto/contrato. La documentación de Checkout v4 indica que esa versión dejará de estar disponible pronto y orienta a migrar a Checkout Custom; evitar iniciar una integración nueva sobre v4. Culqi también documenta webhooks para reflejar pagos/órdenes en el backend. Su página comercial publica tarifas referenciales, sujetas a monto, método, volumen y condiciones; hay que confirmar cotización, impuestos y contrato directamente antes de decidir.

**Criterio práctico:** comparar checkout alojado/embebido, medios usados por los clientes, costo total real, liquidación, soporte, reembolsos, ambiente de pruebas y facilidad de verificar webhooks. No elegir solo por porcentaje anunciado.

### Reglas de implementación de pagos

- Crear la orden desde servidor usando el total calculado y autorizado por la operación; ignorar precios enviados por el navegador.
- Asociar el pago con un `order_id` interno y una referencia idempotente.
- Guardar solo IDs, importes, moneda y estados del proveedor; jamás número completo de tarjeta o CVV.
- Verificar firma/autenticidad del webhook y volver a consultar el pago al proveedor cuando corresponda.
- Hacer el procesamiento idempotente: una notificación repetida no crea doble pago ni duplica pedidos.
- Mantener separados pago, pedido y reserva; definir qué pasa con pago aprobado pero fecha no disponible, reembolso y cancelación.
- Probar pagos aprobados, rechazados, pendientes, duplicados, reembolso y demora/duplicación de webhook en sandbox.

## Seguridad, privacidad y operación

- Habilitar RLS desde el primer esquema. Cliente autenticado: puede consultar su perfil y sus propios pedidos; no puede fijar el precio, aprobar pagos, cambiar roles ni ver pedidos ajenos. Las operaciones administrativas requieren rol explícito y protección adicional.
- Validar en servidor tipos, rangos, fechas disponibles, importes y transición permitida entre estados. Limitar spam y abuso de formularios.
- Mantener secretos en variables seguras del entorno servidor; rotarlos si se exponen. Usar HTTPS, copias de seguridad y entornos separados de pruebas y producción.
- Pedir consentimiento claro antes de recopilar datos y explicar finalidad, conservación y canal para ejercer derechos. Recopilar distrito y contacto al inicio; dirección exacta solo al coordinar el servicio. Definir plazo de borrado/anonimización y quién accede a la información.
- Perú cuenta con la Ley N.° 29733 de Protección de Datos Personales y un nuevo reglamento aprobado por D.S. 016-2024-JUS. Antes de producción se debe revisar el aviso de privacidad, base legal/consentimiento, atención de derechos, encargados/proveedores y obligaciones aplicables con asesoría local. Esta nota es técnica, no asesoría legal.
- Acordar con contabilidad qué comprobante corresponde al modelo real del negocio. SUNAT diferencia, entre otros, recibo por honorarios para servicios independientes y boleta/factura en operaciones de personas con negocio/empresa; la figura correcta depende de cómo se constituya y opere Mesa Criolla.

## Plan incremental

### Etapa 0 — validar operación (ahora)

Seguir con WhatsApp, registrar manualmente solicitud, cotización, reserva completada, distrito, platos y motivo de abandono en una hoja controlada. Definir política de precio, adelanto, cambio/cancelación, capacidad semanal, emisión de comprobante y responsable de atender. No recopilar direcciones completas si aún no hay reserva.

### Etapa 1 — solicitudes persistentes

Crear proyecto Supabase, esquema SQL, políticas RLS y formulario que guarde solicitudes. Confirmación todavía manual. Enviar una confirmación clara y conservar el enlace WhatsApp. Añadir panel interno con acceso restringido o usar temporalmente Supabase Studio solo para el equipo autorizado.

### Etapa 2 — cuentas y área de cliente

Configurar Google OAuth, dominio y URLs de retorno autorizadas; construir acceso/recuperación de sesión, perfil mínimo y lista de pedidos. Permitir cambiar/cancelar una solicitud según reglas de negocio. Mantener la opción de consulta sin cuenta si reduce fricción.

### Etapa 3 — operación administrativa

Bandeja de solicitudes, filtros por fecha/estado/zona, edición de cotización, capacidad/disponibilidad y registro de acciones. Notificaciones por correo. WhatsApp automatizado puede esperar hasta que el volumen lo justifique y se definan consentimiento y plantillas.

### Etapa 4 — pagos

Elegir proveedor tras comparar condiciones; integrar orden en servidor, retorno, webhook firmado, actualización idempotente, comprobantes y flujo de devolución. Salir primero con sandbox y después con una prueba controlada de bajo importe.

### Etapa 5 — escalar

Añadir métricas de conversión y tiempos de respuesta, disponibilidad/calendario, recordatorios, segmentación y automatización solo cuando exista volumen. Preparar monitoreo de errores, backups, restauración y revisión periódica de permisos. Separar aplicación/servicios si los límites del MVP aparecen en el uso real.

## Costos y límites

Supabase, hosting, correo transaccional y pasarela pueden tener niveles gratuitos o cobrados según uso y condiciones que cambian. También hay costos de implementación, soporte, mensajes y comisiones por pago. No incluyo montos estimados porque los precios dependen de plan, volumen, tipo de cuenta, impuestos y fecha; comprobar tarifarios oficiales antes de contratar. La pasarela no reemplaza la contabilidad, emisión de comprobantes ni conciliación bancaria.

## Decisiones por tomar antes de programar

1. ¿El servicio acepta pedidos solo con fecha confirmada manualmente o reservará franjas disponibles en línea?
2. ¿Se pedirá cuenta obligatoria al confirmar, o invitado con acceso por enlace al correo?
3. ¿Se cobrará adelanto? ¿Cuánto y con qué política de cancelación/reembolso?
4. ¿Qué distritos, capacidad, precios y datos mínimos se registrarán?
5. ¿Quién administra solicitudes y qué roles existen?
6. ¿Qué entidad/cuenta recibirá el dinero y qué comprobante emitirá?
7. ¿Mercado Pago o Culqi ofrece mejores condiciones para la cuenta y clientes concretos?

## Documentación oficial consultada

- [Supabase: inicio de sesión con Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase: seguridad y Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Firebase: autenticación con Google en web](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase: reglas de seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Mercado Pago Perú: Checkout Pro Orders, resumen](https://www.mercadopago.com.pe/developers/es/docs/checkout-pro-orders/overview)
- [Mercado Pago Perú: crear una orden Checkout Pro](https://www.mercadopago.com.pe/developers/es/docs/checkout-pro-orders/create-order)
- [Mercado Pago Perú: notificaciones y webhooks](https://www.mercadopago.com.pe/developers/es/docs/checkout-pro-orders/notifications)
- [Culqi: Checkout Custom](https://docs.culqi.com/es/documentacion/checkout/checkout-custom)
- [Culqi: webhooks](https://docs.culqi.com/es/documentacion/pagos-online/webhooks/)
- [Culqi: producto y tarifas referenciales](https://culqi.com/productos/online-pasarela-de-pagos/)
- [Perú: Ley N.° 29733](https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/243470-29733)
- [D.S. 016-2024-JUS, reglamento de la Ley de Protección de Datos Personales](https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_016-2024-jus.pdf)
- [SUNAT: comprobantes de pago](https://orientacion.sunat.gob.pe/04-comprobantes-de-pago)

---

**Conclusión:** no se recomienda empezar por login y cobro como funcionalidades aisladas. El paso que reduce riesgo es registrar solicitudes y administrar estados de forma segura; después introducir cuentas para consultar pedidos, y finalmente cobrar un precio ya confirmado con webhook verificado. Así la tecnología acompaña la operación real del piloto sin convertir una solicitud en una reserva o pago incorrectos.
