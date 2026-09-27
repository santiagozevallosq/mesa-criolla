# Mesa Criolla � planteamiento del MVP

Versi�n: 0.2  
Estado: concepto propuesto para validar, no datos comerciales definitivos.

## 1. Idea central

**Mesa Criolla lleva el sabor de casa a tu cocina:** una cocinera prepara comida criolla en el hogar del cliente, con ingredientes que el cliente elige y compra.

La experiencia debe sentirse dom�stica, cordial y transparente. El cliente puede conversar sobre sus gustos, saber qu� productos se usar�n y ver c�mo se prepara su comida. La web presenta la propuesta y facilita la primera conversaci�n; no intenta automatizar todo el servicio.

**Frase de marca propuesta:** �Sabor de casa, hecho en tu cocina�.

**Nombre de trabajo:** Mesa Criolla. Falta verificar disponibilidad de marca, dominio y redes antes de invertir en identidad o publicidad.

## 2. Cliente inicial recomendado

Personas ocupadas, parejas y familias peque�as que viven en una zona acotada y quieren comer comida criolla en casa, pero tienen poco tiempo para cocinar. Valoran el sabor familiar y quieren decidir qu� ingredientes entran a su cocina.

Para empezar, conviene atender una sola ciudad y pocos distritos. La zona concreta se definir� seg�n d�nde pueda operar la cocinera piloto.

## 3. Oferta de prueba recomendada

### Paquete: �Mi semana criolla�

- Una visita de cocina en el hogar del cliente.
- El cliente elige **3 preparaciones** de un men� inicial corto.
- Se acuerda por WhatsApp el tama�o de las porciones antes de la visita.
- Mesa Criolla env�a una lista precisa de ingredientes y cantidades.
- El cliente compra los ingredientes antes de la visita.
- La cocinera prepara y porciona las comidas en casa.
- La cocinera deja ordenada el �rea de trabajo y las preparaciones identificadas.
- Se entrega una gu�a breve de conservaci�n, definida con buenas pr�cticas antes de ofrecer el servicio.

El prop�sito es dejar varias comidas caseras listas. No se debe prometer todav�a un n�mero de d�as, duraci�n exacta de visita o beneficio nutricional hasta probar las recetas y la operaci�n.

### Men� piloto sugerido

Comenzar con cinco platos conocidos y acotados, y permitir escoger tres:

- Aj� de gallina.
- Seco de res con frejoles.
- Estofado de pollo.
- Lentejas guisadas al estilo criollo.
- Arroz con pollo.

Son ejemplos para conversar, no un men� confirmado. Antes de publicarlo hay que confirmar qui�n puede prepararlos bien, cu�nto demoran, qu� utensilios requieren y c�mo se almacenan. Se pueden ajustar platos seg�n especialidad de la cocinera.

### Precio y confirmaci�n

No publicar un precio inventado. Primero medir duraci�n real, costo de trabajo, traslado y preparaci�n de la lista de compras. Como el cliente compra los insumos, el precio del servicio puede cotizarse por la visita y el n�mero de preparaciones/porciones acordado.

En el piloto, solicitud y confirmaci�n se hacen manualmente por WhatsApp. Se informa el precio completo antes de confirmar la fecha. No hace falta pago integrado en la web.

## 4. Posicionamiento y tono

**Promesa:** comida criolla casera, preparada en tu propia cocina y con ingredientes elegidos por ti.

**Pilares de confianza:**

- Claridad: lista de ingredientes y alcance de la visita antes de reservar.
- Cercan�a: trato respetuoso y c�lido, como recibir a alguien de confianza en casa.
- Control: el cliente compra los insumos y puede conversar sobre sus preferencias.
- Cuidado: orden en la cocina, porciones identificadas y orientaci�n sencilla de conservaci�n.

Usar palabras como �casera�, �reci�n preparada� o �con tus ingredientes� cuando describan fielmente el servicio. Evitar promesas m�dicas, dietas terap�uticas o asegurar que todos los platos son �saludables� sin criterios claros. Se puede hablar de preferencias (por ejemplo, menos sal) solo si la preparaci�n realmente puede cumplirlo de manera consistente.

## 5. Recorrido de la primera reserva

1. La persona llega a la p�gina y entiende qu� servicio es, d�nde se ofrece y qu� lo hace distinto.
2. Revisa el men� piloto y elige �Consultar por WhatsApp�.
3. El mensaje prellenado pregunta zona, n�mero de comensales, platos de inter�s y fechas posibles.
4. La persona que atiende confirma cobertura, porciones, lista de compra, disponibilidad y precio.
5. El cliente compra los ingredientes y prepara el espacio/utensilios acordados.
6. La cocinera cocina, porciona, identifica las preparaciones y deja ordenada el �rea.
7. Despu�s del servicio, se solicita retroalimentaci�n; con autorizaci�n, se podr�a pedir permiso para publicar una rese�a.

No se recopilan datos en una base propia para esta prueba. La coordinaci�n ocurre en el canal que el usuario decide abrir.

## 6. P�gina MVP

Una sola p�gina, enfocada a m�vil:

1. **Cabecera:** Mesa Criolla, �C�mo funciona�, �Men�� y bot�n �Consultar por WhatsApp�.
2. **Hero:** �Sabor de casa, hecho en tu cocina� + una frase que explique el servicio y la zona cuando est� definida.
3. **C�mo funciona:** eliges 3 platos, recibes la lista de compras, cocinamos en tu casa.
4. **Men� piloto:** platos disponibles, sin inventar fotos o afirmaciones.
5. **Qu� incluye:** visita, preparaci�n, porcionado, orden b�sico y gu�a de conservaci�n.
6. **Qu� necesitas:** comprar ingredientes y contar con cocina/utensilios acordados.
7. **Preguntas frecuentes:** zona, lista de compras, duraci�n, porciones, utensilios y conservaci�n.
8. **CTA final:** enlace a WhatsApp con mensaje prellenado.
9. **Pie:** contacto y redes existentes.

Hasta contar con material propio, usar fotograf�a real autorizada o im�genes provisionales identificadas internamente como tales. No publicar testimonios, cifras, certificaciones o perfiles ficticios.

## 7. Arquitectura m�nima

- Frontend est�tico en HTML sem�ntico, CSS y JavaScript nativo.
- Sin backend, cuentas, base de datos, calendario ni pagos en l�nea en la primera versi�n.
- WhatsApp como canal de contacto voluntario con mensaje prellenado.
- Hosting est�tico con HTTPS al momento de publicar.
- El men� y la zona pueden mantenerse en el contenido de la p�gina hasta que cambien con frecuencia.
- Medici�n manual: consultas recibidas, zona, inter�s y reservas completadas. Evitar instalar rastreadores hasta que aporten una decisi�n concreta.

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

## 8. Validaci�n inicial

Hacer un piloto peque�o con hogares cercanos en la zona donde pueda operar la cocinera. El objetivo es aprender antes de ampliar men� o construir tecnolog�a.

Registrar por cada visita: tiempo de preparaci�n, tiempos de compra/lista (si aplica), platos elegidos, porciones, problemas de utensilios, costo de traslado, dudas antes de reservar y satisfacci�n del cliente.

Se�al inicial de inter�s: personas que, despu�s de conocer el precio real y el proceso, acuerdan una fecha y pagan el servicio. Los comentarios positivos por s� solos no prueban disposici�n a pagar.

## 9. Secuencia de construcci�n

1. Acordar este planteamiento y precisar ciudad/distritos y responsable de cocinar.
2. Hacer un ensayo operativo del men� para estimar tiempos, porciones y requisitos de cocina.
3. Cerrar precio, reglas simples de reserva/cancelaci�n y gu�a de conservaci�n.
4. Redactar y revisar el contenido de la p�gina con datos reales.
5. Construir la landing est�tica accesible y adaptable a m�vil.
6. Conectar y probar el enlace de WhatsApp con el n�mero del negocio.
7. Publicar en hosting est�tico y observar consultas/pilotos.
8. Decidir si alg�n problema repetido justifica un formulario o backend.

## 10. Decisiones que quedan abiertas

- Ciudad y distritos iniciales.
- Persona que cocinar� y experiencia que se puede comunicar con honestidad.
- Men� piloto final, porciones exactas y disponibilidad de utensilios.
- Duraci�n y precio de la visita.
- N�mero de WhatsApp, horarios y responsable de responder.
- Reglas de reserva, cambios y cancelaci�n.
- Identidad visual, fotos propias y disponibilidad del nombre.

