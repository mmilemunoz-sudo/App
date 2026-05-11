# App Remis Mariela

## Objetivo

Aplicacion local-first para que Mariela registre viajes, gastos y vea resumenes en pocos toques desde el celular.

## Stack

- React + Vite para una app web rapida.
- TailwindCSS para estilos responsive.
- SQLite en navegador con `sql.js`, persistido en IndexedDB.
- Supabase queda disponible para una futura sincronizacion si se quiere backup o multi-dispositivo.

## Estructura

- `src/app`: composicion principal y navegacion simple.
- `src/features/dashboard`: resumen, estadisticas y ultimos viajes.
- `src/features/calendar`: calendario mensual y resumen por dia.
- `src/features/history`: historial combinado de viajes y gastos.
- `src/features/trips`: registro ultra rapido de viajes.
- `src/features/expenses`: registro rapido de gastos.
- `src/data`: acceso a SQLite, migraciones y persistencia.
- `src/components/ui`: componentes visuales reutilizables.
- `src/lib`: utilidades de moneda y fecha.
- `src/types`: tipos compartidos del dominio.

## Base de datos

Tabla `trips`:

- `id`
- `destination`
- `amount`
- `payment_method`
- `notes`
- `created_at`

Tabla `expenses`:

- `id`
- `category`
- `amount`
- `notes`
- `created_at`

Indices:

- `idx_trips_created_at`
- `idx_expenses_created_at`

## Flujo

1. Inicio muestra saludo, resumen del dia, acciones principales y ultimos viajes.
2. Nuevo viaje prioriza destino, monto y metodo de pago.
3. Nuevo gasto prioriza categoria y monto.
4. Estadisticas resume semana y mes.

## Decisiones de diseÃ±o

- Navegacion por estado interno para mantener una primera version liviana.
- Botones de minimo 56px de alto para uso tactil.
- Formulario de viaje con monto numerico y previsualizacion en moneda.
- Destinos frecuentes basados en los ultimos registros.
- Capa de datos aislada para poder cambiar o sumar sincronizacion sin tocar las pantallas.


## Experiencia humana

La app debe sentirse hecha para Mariela, no para una flota corporativa. El tono visual y verbal busca calma, claridad y cercania.

Principios:

- Mensajes breves y suaves: "Todo listo para empezar", "Viaje guardado", "Gran trabajo hoy".
- Navegacion superior en pildora para evitar una barra inferior generica.
- Colores rosados, malva y blanco calido con contraste suficiente.
- Tarjetas simples, sin saturar la pantalla.
- Animaciones leves solo para transiciones y confirmaciones.
- Prioridad absoluta: registrar viajes y gastos en pocos toques.

Ideas futuras:

- Cierre del dia con una frase clara y numeros simples.
- Destinos frecuentes con repeticion de recorrido.
- Recordatorio discreto si hubo muchos viajes sin cargar gastos.
- Modo descanso para mostrar solo lo esencial al final de la jornada.
