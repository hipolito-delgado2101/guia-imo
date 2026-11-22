# Guía IMO

```sh
npm run dev
```
## Funciones

- **Identificación:** nombre de la mercancía, componentes, número ONU opcional y archivo de la ficha de datos de seguridad (FDS).
- **Clasificación orientativa:** consulta de un catálogo limitado de referencias ONU, clase, riesgos, etiquetas y grupo de embalaje cuando corresponde.
- **Documentación y permisos:** preparación de documentos a revisar según la mercancía, operación y destino; incluye DGD, FDS y documentación de transporte.
- **Checklist:** seguimiento de documentos disponibles y pendientes, con observaciones y fechas cuando corresponda.
- **Guía de seguridad:** información general sobre manipulación, almacenamiento, embalaje, etiquetado y segregación.
- **Alertas:** pendientes y vencimientos visibles en la aplicación, con notificaciones del navegador cuando este lo permite y el usuario las autoriza.

## Verificar y preparar publicación

```sh
npm run check
npm run build
```

## Organización del código

```text
index.html                 Estructura y accesibilidad
styles.css                 Diseño y adaptación a pantallas
app.js                     Interfaz y almacenamiento local
domain.js                  Reglas y funciones de la aplicación
content-data.js            Referencias y contenido orientativo
assets/                    Recursos visuales
design-skills/             Skills de diseño incorporadas
tests/                     Pruebas de la lógica
scripts/serve.mjs          Vista previa local
scripts/build.mjs          Preparación de archivos públicos
.github/workflows/deploy.yml  Publicación en GitHub Pages
```
