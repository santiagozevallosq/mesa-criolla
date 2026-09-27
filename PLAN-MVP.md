# Mesa Criolla — planteamiento del MVP

Versión: 0.2  
Estado: concepto propuesto para validar, no datos comerciales definitivos.

## 1. Idea central

**Mesa Criolla lleva el sabor de casa a tu cocina:** una cocinera prepara comida criolla en el hogar del cliente, con ingredientes que el cliente elige y compra.

La experiencia debe sentirse doméstica, cordial y transparente. El cliente puede conversar sobre sus gustos, saber qué productos se usarán y ver cómo se prepara su comida. La web presenta la propuesta y facilita la primera conversación; no intenta automatizar todo el servicio.

**Frase de marca propuesta:** “Sabor de casa, hecho en tu cocina”.

**Nombre de trabajo:** Mesa Criolla. Falta verificar disponibilidad de marca, dominio y redes antes de invertir en identidad o publicidad.

## 2. Cliente inicial recomendado

Personas ocupadas, parejas y familias pequeñas que viven en una zona acotada y quieren comer comida criolla en casa, pero tienen poco tiempo para cocinar. Valoran el sabor familiar y quieren decidir qué ingredientes entran a su cocina.

Para empezar, conviene atender una sola ciudad y pocos distritos. La zona concreta se definirá según dónde pueda operar la cocinera piloto.

## 3. Oferta de prueba recomendada

### Paquete: “Mi semana criolla”

- Una visita de cocina en el hogar del cliente.
- El cliente elige **3 preparaciones** de un menú inicial corto.
- Se acuerda por WhatsApp el tamaño de las porciones antes de la visita.
- Mesa Criolla envía una lista precisa de ingredientes y cantidades.
- El cliente compra los ingredientes antes de la visita.
- La cocinera prepara y porciona las comidas en casa.
- La cocinera deja ordenada el área de trabajo y las preparaciones identificadas.
- Se entrega una guía breve de conservación, definida con buenas prácticas antes de ofrecer el servicio.

El propósito es dejar varias comidas caseras listas. No se debe prometer todavía un número de días, duración exacta de visita o beneficio nutricional hasta probar las recetas y la operación.

### Menú piloto sugerido

Comenzar con cinco platos conocidos y acotados, y permitir escoger tres:

- Ají de gallina.
- Seco de res con frejoles.
- Estofado de pollo.
- Lentejas guisadas al estilo criollo.
- Arroz con pollo.

Son ejemplos para conversar, no un menú confirmado. Antes de publicarlo hay que confirmar quién puede prepararlos bien, cuánto demoran, qué utensilios requieren y cómo se almacenan. Se pueden ajustar platos según especialidad de la cocinera.

### Precio y confirmación

No publicar un precio inventado. Primero medir duración real, costo de trabajo, traslado y preparación de la lista de compras. Como el cliente compra los insumos, el precio del servicio puede cotizarse por la visita y el número de preparaciones/porciones acordado.

En el piloto, solicitud y confirmación se hacen manualmente por WhatsApp. Se informa el precio completo antes de confirmar la fecha. No hace falta pago integrado en la web.

## 4. Posicionamiento y tono

**Promesa:** comida criolla casera, preparada en tu propia cocina y con ingredientes elegidos por ti.

**Pilares de confianza:**

- Claridad: lista de ingredientes y alcance de la visita antes de reservar.
- Cercanía: trato respetuoso y cálido, como recibir a alguien de confianza en casa.
- Control: el cliente compra los insumos y puede conversar sobre sus preferencias.
- Cuidado: orden en la cocina, porciones identificadas y orientación sencilla de conservación.

Usar palabras como “casera”, “recién preparada” o “con tus ingredientes” cuando describan fielmente el servicio. Evitar promesas médicas, dietas terapéuticas o asegurar que todos los platos son “saludables” sin criterios claros. Se puede hablar de preferencias (por ejemplo, menos sal) solo si la preparación realmente puede cumplirlo de manera consistente.

## 5. Recorrido de la primera reserva

1. La persona llega a la página y entiende qué servicio es, dónde se ofrece y qué lo hace distinto.
2. Revisa el menú piloto y elige “Consultar por WhatsApp”.
3. El mensaje prellenado pregunta zona, número de comensales, platos de interés y fechas posibles.
4. La persona que atiende confirma cobertura, porciones, lista de compra, disponibilidad y precio.
5. El cliente compra los ingredientes y prepara el espacio/utensilios acordados.
6. La cocinera cocina, porciona, identifica las preparaciones y deja ordenada el área.
7. Después del servicio, se solicita retroalimentación; con autorización, se podría pedir permiso para publicar una reseña.

No se recopilan datos en una base propia para esta prueba. La coordinación ocurre en el canal que el usuario decide abrir.

## 6. Página MVP

Una sola página, enfocada a móvil:

1. **Cabecera:** Mesa Criolla, “Cómo funciona”, “Menú” y botón “Consultar por WhatsApp”.
2. **Hero:** “Sabor de casa, hecho en tu cocina” + una frase que explique el servicio y la zona cuando esté definida.
3. **Cómo funciona:** eliges 3 platos, recibes la lista de compras, cocinamos en tu casa.
4. **Menú piloto:** platos disponibles, sin inventar fotos o afirmaciones.
5. **Qué incluye:** visita, preparación, porcionado, orden básico y guía de conservación.
6. **Qué necesitas:** comprar ingredientes y contar con cocina/utensilios acordados.
7. **Preguntas frecuentes:** zona, lista de compras, duración, porciones, utensilios y conservación.
8. **CTA final:** enlace a WhatsApp con mensaje prellenado.
9. **Pie:** contacto y redes existentes.

Hasta contar con material propio, usar fotografía real autorizada o imágenes provisionales identificadas internamente como tales. No publicar testimonios, cifras, certificaciones o perfiles ficticios.

## 7. Arquitectura mínima

- Frontend estático en HTML semántico, CSS y JavaScript nativo.
- Sin backend, cuentas, base de datos, calendario ni pagos en línea en la primera versión.
- WhatsApp como canal de contacto voluntario con mensaje prellenado.
- Hosting estático con HTTPS al momento de publicar.
- El menú y la zona pueden mantenerse en el contenido de la página hasta que cambien con frecuencia.
- Medición manual: consultas recibidas, zona, interés y reservas completadas. Evitar instalar rastreadores hasta que aporten una decisión concreta.

Estructura prevista:

~~~text
/
  index.html
  styles.css
  script.js
  assets/
  README.md
  PLAN-MVP.md
~~~

## 8. Validación inicial

Hacer un piloto pequeño con hogares cercanos en la zona donde pueda operar la cocinera. El objetivo es aprender antes de ampliar menú o construir tecnología.

Registrar por cada visita: tiempo de preparación, tiempos de compra/lista (si aplica), platos elegidos, porciones, problemas de utensilios, costo de traslado, dudas antes de reservar y satisfacción del cliente.

Señal inicial de interés: personas que, después de conocer el precio real y el proceso, acuerdan una fecha y pagan el servicio. Los comentarios positivos por sí solos no prueban disposición a pagar.

## 9. Secuencia de construcción

1. Acordar este planteamiento y precisar ciudad/distritos y responsable de cocinar.
2. Hacer un ensayo operativo del menú para estimar tiempos, porciones y requisitos de cocina.
3. Cerrar precio, reglas simples de reserva/cancelación y guía de conservación.
4. Redactar y revisar el contenido de la página con datos reales.
5. Construir la landing estática accesible y adaptable a móvil.
6. Conectar y probar el enlace de WhatsApp con el número del negocio.
7. Publicar en hosting estático y observar consultas/pilotos.
8. Decidir si algún problema repetido justifica un formulario o backend.

## 10. Decisiones que quedan abiertas

- Ciudad y distritos iniciales.
- Persona que cocinará y experiencia que se puede comunicar con honestidad.
- Menú piloto final, porciones exactas y disponibilidad de utensilios.
- Duración y precio de la visita.
- Número de WhatsApp, horarios y responsable de responder.
- Reglas de reserva, cambios y cancelación.
- Identidad visual, fotos propias y disponibilidad del nombre.

