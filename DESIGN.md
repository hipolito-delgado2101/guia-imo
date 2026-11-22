# Diseño de Guía IMO

Superficie: aplicación de trabajo para preparar un expediente marítimo. Prioriza identificar mercancía, revisar documentos y localizar pendientes; la guía de seguridad favorece la lectura. El diseño conserva una sola familia sans del sistema y navegación conocida.

## Sistema visual

- Fondo de trabajo `#f5f7f6`, superficies blancas, texto `#20312f`, texto secundario `#64726e`.
- Verde `#246e62` para acciones y selección; azul marítimo `#163e46` para la bienvenida. Los estados combinan color, icono y texto.
- Prosa de 16 px, controles y etiquetas de 14 px, metadatos de 12 px como mínimo; escala en `rem` y títulos proporcionados al panel.
- Bordes discretos, radios de 12–16 px en paneles, una familia coherente de iconos SVG.
- Sidebar en escritorio; menú lateral con foco visible en pantallas de hasta 900 px. Formularios apilados y filtros en dos columnas cuando el espacio lo requiere.
- Transiciones cortas sobre propiedades concretas, respuesta al pulsar y movimiento reducido según la preferencia del sistema. No hay una secuencia de animación que retrase el uso.

## Skills incorporadas y criterios aplicados

| Recurso | Fuente | Aplicación en esta herramienta |
| --- | --- | --- |
| Emil Kowalski · Design Engineering | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng) | Estados de interacción precisos, respuesta de pulsación, curvas de salida rápidas y respeto de movimiento reducido. |
| Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable/tree/main/.agents/skills/impeccable) | Jerarquía, consistencia, accesibilidad, contraste, tamaños legibles y adaptación estructural del panel. |
| Taste | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/taste-skill) | Alineación, un solo sistema de componentes, controles que responden y texto concreto. |

Las tres copias están en `design-skills/` como material de desarrollo del proyecto. No se incluyen en `dist/` ni se presentan como dependencias de ejecución. Las pautas de Taste para páginas comerciales —como secciones a pantalla completa o efectos escénicos— se adaptan al objetivo funcional del panel: el usuario necesita operar y consultar, con contenido accesible sin animación decorativa.

## Verificación

La revisión estática cubrió escala tipográfica, contraste del texto secundario, foco, navegación móvil oculta, superficies táctiles y movimiento reducido. La verificación visual y funcional se realiza sobre la aplicación renderizada a tamaños de escritorio y celular; no se afirma haber ejecutado los comprobadores de navegador de las skills. El cargador de contexto de Impeccable no pudo instalar su motor en el entorno aislado; se consultaron directamente las instrucciones y referencias del paquete.
