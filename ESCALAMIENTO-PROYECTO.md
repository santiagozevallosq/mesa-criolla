# Investigaci�n: c�mo escalar Mesa Criolla

**Fecha de consulta:** 27 de septiembre de 2026  
**Estado del proyecto revisado:** MVP de landing est�tica en HTML, CSS y JavaScript; hoy el formulario prepara una consulta y abre WhatsApp. No hay cuentas, API, persistencia propia de pedidos ni cobro en l�nea.

## Resumen ejecutivo

Para evolucionar sin rehacer el producto entero, la ruta m�s simple para este proyecto es:

1. Mantener la landing como presentaci�n p�blica y a�adir una peque�a aplicaci�n de reservas.
2. Usar **Supabase Auth con Google** para iniciar sesi�n, **Postgres** para clientes y pedidos, y **Row Level Security (RLS)** para que cada usuario acceda solo a sus propios datos.
3. A�adir funciones de servidor (por ejemplo, Supabase Edge Functions) para crear reservas confirmadas, iniciar pagos y recibir webhooks. El navegador nunca debe decidir si un pago fue aprobado ni contener secretos privados.
4. Empezar los pagos con **Mercado Pago Checkout Pro**: se paga en el entorno de Mercado Pago y luego se vuelve al sitio. Confirmar el estado real mediante webhook consultado/verificado por el servidor. Evaluar Culqi como alternativa local y comparar condiciones comerciales vigentes antes de contratar.
5. Implementar por etapas y mantener WhatsApp como canal de ayuda durante la transici�n.

La cuenta no deber�a ser requisito para leer el men� o preguntar. Conviene pedir login cuando el cliente vaya a guardar/ver sus reservas; si se permite una solicitud sin cuenta, se puede invitar luego a reclamarla mediante enlace de acceso enviado al correo.

## Estado actual y consecuencias

Los archivos `index.html`, `styles.css` y `script.js` forman una web est�tica sin un proceso servidor. El JavaScript construye un mensaje con distrito, cantidad de personas, platos y fecha tentativa; lo pasa a WhatsApp. Estos datos no se guardan en una base propia. Por lo tanto, a�adir un bot�n �Ingresar con Google� por s� solo no crea un backend de pedidos: hace falta definir API, almacenamiento, reglas de acceso, estados del pedido y operaci�n administrativa.

No hace falta migrar inmediatamente a React o Next.js. Supabase ofrece cliente JavaScript para una aplicaci�n web peque�a. Si luego aparecen paneles complejos, gesti�n de disponibilidad, notificaciones o varias integraciones, ser�a razonable separar un frontend de aplicaci�n (por ejemplo, Vite/React o Next.js) y un backend con endpoints protegidos. La decisi�n depende de la complejidad y el hosting definitivo.

## Arquitectura recomendada

```text
Sitio p�blico (landing + men�)
        │ HTTPS
        ├── Supabase Auth: Google OAuth y sesi�n
        ├── Postgres: perfiles, reservas y pagos
        │      └── RLS: cada cliente ve sus propios registros
        └── Funciones de servidor
               ├── Crear/actualizar pedido con validaciones
               ├── Crear sesi�n u orden de pago
               └── Webhook del proveedor → verificar evento → actualizar pago/pedido
```

**Por qu� Supabase para este caso:** el negocio tiene relaciones naturales (usuario, pedido, platos, pagos), por lo que una base SQL facilita informes y consultas administrativas. Google OAuth est� documentado y se configura en Google Cloud y Supabase. Supabase permite mantener el frontend ligero y aplicar reglas de base por usuario. No se debe publicar la clave `service_role` en el navegador: solo la clave p�blica/anon dise�ada para uso cliente, con RLS correctamente habilitado.

**Alternativa v�lida:** Firebase Authentication con Google y Cloud Firestore puede ser r�pido si se prioriza una integraci�n Google/NoSQL y tiempo real. Requiere dise�ar cuidadosamente las reglas de Firestore y el modelo documental. Para reportes y consultas de pedidos relacionados, Postgres suele ser m�s directo. No conviene operar ambos proveedores de identidad/base de datos al comienzo.

## Datos que convendr�a almacenar

Dise�o inicial, deliberadamente peque�o:

- **profiles**: `id` (igual al usuario autenticado), nombre visible, correo, tel�fono opcional, fecha de creaci�n. No pedir m�s datos que los necesarios.
- **orders**: `id`, `user_id`, distrito, direcci�n solo cuando sea necesaria para una reserva confirmada, comensales, fecha solicitada, fecha acordada, estado, notas, precio acordado en PEN, consentimiento/fecha de aceptaci�n y marcas de tiempo.
- **order_items**: `order_id`, plato, porciones y observaciones. Guardar una copia del nombre/precio acordados si el men� o precio puede cambiar.
- **payments**: `order_id`, proveedor, identificador externo, monto en c�ntimos o decimal controlado, moneda `PEN`, estado, fecha de pago/reembolso. No almacenar datos de tarjeta ni CVV.
- **audit_events** (opcional al inicio): cambios administrativos de estado y actor, �til para resolver discrepancias.

Estados sugeridos del pedido: `requested` → `quoted` → `awaiting_customer` → `confirmed` → `completed`; adem�s `cancelled`. Estados del pago separados: `not_required`, `pending`, `approved`, `rejected`, `refunded`, `chargeback`. Un pago no debe convertir por s� solo una solicitud sin revisar en una reserva confirmada.

## Recorrido recomendado para la persona cliente

1. Ve men�, cobertura y condiciones sin registrarse.
2. Env�a una solicitud sencilla; la operaci�n confirma zona, disponibilidad, porciones y precio.
3. Cuando el servicio tenga fecha y precio confirmados, crea una cuenta con Google o inicia sesi�n para consultar su reserva. Alternativamente, se puede reservar primero como invitado y enviar un enlace seguro de acceso al correo.
4. Si se acuerda un adelanto, el backend crea la orden de pago por el importe confirmado y redirige al checkout.
5. El proveedor notifica al backend. El backend valida el webhook/consulta la operaci�n y cambia el pago. El usuario ve una pantalla de resultado, pero el retorno del navegador no cuenta como prueba de pago.
6. El cliente consulta sus reservas y recibe confirmaci�n por correo/WhatsApp. La operaci�n mantiene una bandeja sencilla para revisar solicitudes, cotizar, confirmar o cancelar.

**Decisi�n comercial pendiente:** el MVP plantea una coordinaci�n manual y todav�a no fija precio, adelanto, cancelaciones ni capacidad. Primero medir demanda y acordar pol�tica de reservas; implementar pago online tiene sentido cuando haya un precio y un proceso de confirmaci�n estables.

## Pagos en Per�: opciones encontradas

### Mercado Pago Checkout Pro � recomendaci�n inicial para evaluar

Checkout Pro redirige a un checkout alojado por Mercado Pago, lo que reduce el manejo directo de datos de tarjeta en la web propia. Su documentaci�n para Per� describe tarjetas, cuenta de Mercado Pago y Yape, sujeto a disponibilidad/configuraci�n de la cuenta. Para una integraci�n nueva, la documentaci�n actual recomienda Orders API; crea la orden en servidor, usa idempotencia por intento, redirige a `checkout_url` y procesa notificaciones webhook. Debe hacerse una compra de prueba antes de producci�n.

**Ventajas:** integraci�n de checkout alojado, retorno al sitio y webhooks documentados; menos superficie propia de pagos que un formulario totalmente personalizado.  
**A verificar:** requisitos de cuenta de vendedor/RUC, medios habilitados para esta cuenta, comisi�n y plazo de abono actuales, reembolsos, contracargos y documentaci�n tributaria.

### Culqi � alternativa local para comparar

Culqi ofrece checkout integrable con tarjetas, Yape, PagoEfectivo y otros medios seg�n producto/contrato. La documentaci�n de Checkout v4 indica que esa versi�n dejar� de estar disponible pronto y orienta a migrar a Checkout Custom; evitar iniciar una integraci�n nueva sobre v4. Culqi tambi�n documenta webhooks para reflejar pagos/�rdenes en el backend. Su p�gina comercial publica tarifas referenciales, sujetas a monto, m�todo, volumen y condiciones; hay que confirmar cotizaci�n, impuestos y contrato directamente antes de decidir.

**Criterio pr�ctico:** comparar checkout alojado/embebido, medios usados por los clientes, costo total real, liquidaci�n, soporte, reembolsos, ambiente de pruebas y facilidad de verificar webhooks. No elegir solo por porcentaje anunciado.

### Reglas de implementaci�n de pagos

- Crear la orden desde servidor usando el total calculado y autorizado por la operaci�n; ignorar precios enviados por el navegador.
- Asociar el pago con un `order_id` interno y una referencia idempotente.
- Guardar solo IDs, importes, moneda y estados del proveedor; jam�s n�mero completo de tarjeta o CVV.
- Verificar firma/autenticidad del webhook y volver a consultar el pago al proveedor cuando corresponda.
- Hacer el procesamiento idempotente: una notificaci�n repetida no crea doble pago ni duplica pedidos.
- Mantener separados pago, pedido y reserva; definir qu� pasa con pago aprobado pero fecha no disponible, reembolso y cancelaci�n.
- Probar pagos aprobados, rechazados, pendientes, duplicados, reembolso y demora/duplicaci�n de webhook en sandbox.

## Seguridad, privacidad y operaci�n

- Habilitar RLS desde el primer esquema. Cliente autenticado: puede consultar su perfil y sus propios pedidos; no puede fijar el precio, aprobar pagos, cambiar roles ni ver pedidos ajenos. Las operaciones administrativas requieren rol expl�cito y protecci�n adicional.
- Validar en servidor tipos, rangos, fechas disponibles, importes y transici�n permitida entre estados. Limitar spam y abuso de formularios.
- Mantener secretos en variables seguras del entorno servidor; rotarlos si se exponen. Usar HTTPS, copias de seguridad y entornos separados de pruebas y producci�n.
- Pedir consentimiento claro antes de recopilar datos y explicar finalidad, conservaci�n y canal para ejercer derechos. Recopilar distrito y contacto al inicio; direcci�n exacta solo al coordinar el servicio. Definir plazo de borrado/anonimizaci�n y qui�n accede a la informaci�n.
- Per� cuenta con la Ley N.� 29733 de Protecci�n de Datos Personales y un nuevo reglamento aprobado por D.S. 016-2024-JUS. Antes de producci�n se debe revisar el aviso de privacidad, base legal/consentimiento, atenci�n de derechos, encargados/proveedores y obligaciones aplicables con asesor�a local. Esta nota es t�cnica, no asesor�a legal.
- Acordar con contabilidad qu� comprobante corresponde al modelo real del negocio. SUNAT diferencia, entre otros, recibo por honorarios para servicios independientes y boleta/factura en operaciones de personas con negocio/empresa; la figura correcta depende de c�mo se constituya y opere Mesa Criolla.

## Plan incremental

### Etapa 0 � validar operaci�n (ahora)

Seguir con WhatsApp, registrar manualmente solicitud, cotizaci�n, reserva completada, distrito, platos y motivo de abandono en una hoja controlada. Definir pol�tica de precio, adelanto, cambio/cancelaci�n, capacidad semanal, emisi�n de comprobante y responsable de atender. No recopilar direcciones completas si a�n no hay reserva.

### Etapa 1 � solicitudes persistentes

Crear proyecto Supabase, esquema SQL, pol�ticas RLS y formulario que guarde solicitudes. Confirmaci�n todav�a manual. Enviar una confirmaci�n clara y conservar el enlace WhatsApp. A�adir panel interno con acceso restringido o usar temporalmente Supabase Studio solo para el equipo autorizado.

### Etapa 2 � cuentas y �rea de cliente

Configurar Google OAuth, dominio y URLs de retorno autorizadas; construir acceso/recuperaci�n de sesi�n, perfil m�nimo y lista de pedidos. Permitir cambiar/cancelar una solicitud seg�n reglas de negocio. Mantener la opci�n de consulta sin cuenta si reduce fricci�n.

### Etapa 3 � operaci�n administrativa

Bandeja de solicitudes, filtros por fecha/estado/zona, edici�n de cotizaci�n, capacidad/disponibilidad y registro de acciones. Notificaciones por correo. WhatsApp automatizado puede esperar hasta que el volumen lo justifique y se definan consentimiento y plantillas.

### Etapa 4 � pagos

Elegir proveedor tras comparar condiciones; integrar orden en servidor, retorno, webhook firmado, actualizaci�n idempotente, comprobantes y flujo de devoluci�n. Salir primero con sandbox y despu�s con una prueba controlada de bajo importe.

### Etapa 5 � escalar

A�adir m�tricas de conversi�n y tiempos de respuesta, disponibilidad/calendario, recordatorios, segmentaci�n y automatizaci�n solo cuando exista volumen. Preparar monitoreo de errores, backups, restauraci�n y revisi�n peri�dica de permisos. Separar aplicaci�n/servicios si los l�mites del MVP aparecen en el uso real.

## Costos y l�mites

Supabase, hosting, correo transaccional y pasarela pueden tener niveles gratuitos o cobrados seg�n uso y condiciones que cambian. Tambi�n hay costos de implementaci�n, soporte, mensajes y comisiones por pago. No incluyo montos estimados porque los precios dependen de plan, volumen, tipo de cuenta, impuestos y fecha; comprobar tarifarios oficiales antes de contratar. La pasarela no reemplaza la contabilidad, emisi�n de comprobantes ni conciliaci�n bancaria.

## Decisiones por tomar antes de programar

1. �El servicio acepta pedidos solo con fecha confirmada manualmente o reservar� franjas disponibles en l�nea?
2. �Se pedir� cuenta obligatoria al confirmar, o invitado con acceso por enlace al correo?
3. �Se cobrar� adelanto? �Cu�nto y con qu� pol�tica de cancelaci�n/reembolso?
4. �Qu� distritos, capacidad, precios y datos m�nimos se registrar�n?
5. �Qui�n administra solicitudes y qu� roles existen?
6. �Qu� entidad/cuenta recibir� el dinero y qu� comprobante emitir�?
7. �Mercado Pago o Culqi ofrece mejores condiciones para la cuenta y clientes concretos?

## Documentaci�n oficial consultada

- [Supabase: inicio de sesi�n con Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase: seguridad y Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Firebase: autenticaci�n con Google en web](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase: reglas de seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Mercado Pago Per�: Checkout Pro Orders, resumen](https://www.mercadopago.com.pe/developers/es/docs/checkout-pro-orders/overview)
- [Mercado Pago Per�: crear una orden Checkout Pro](https://www.mercadopago.com.pe/developers/es/docs/checkout-pro-orders/create-order)
- [Mercado Pago Per�: notificaciones y webhooks](https://www.mercadopago.com.pe/developers/es/docs/checkout-pro-orders/notifications)
- [Culqi: Checkout Custom](https://docs.culqi.com/es/documentacion/checkout/checkout-custom)
- [Culqi: webhooks](https://docs.culqi.com/es/documentacion/pagos-online/webhooks/)
- [Culqi: producto y tarifas referenciales](https://culqi.com/productos/online-pasarela-de-pagos/)
- [Per�: Ley N.� 29733](https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/243470-29733)
- [D.S. 016-2024-JUS, reglamento de la Ley de Protecci�n de Datos Personales](https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_016-2024-jus.pdf)
- [SUNAT: comprobantes de pago](https://orientacion.sunat.gob.pe/04-comprobantes-de-pago)

---

**Conclusi�n:** no se recomienda empezar por login y cobro como funcionalidades aisladas. El paso que reduce riesgo es registrar solicitudes y administrar estados de forma segura; despu�s introducir cuentas para consultar pedidos, y finalmente cobrar un precio ya confirmado con webhook verificado. As� la tecnolog�a acompa�a la operaci�n real del piloto sin convertir una solicitud en una reserva o pago incorrectos.
