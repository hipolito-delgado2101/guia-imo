# Guía IMO

Aplicación web en español para organizar la preparación de operaciones marítimas con mercancías peligrosas. Está hecha con HTML, CSS y JavaScript, sin dependencias de ejecución, y se adapta a computadoras y celulares.

## Abrir en tu computadora

Instala Node.js 22 o una versión posterior. En la carpeta del proyecto ejecuta:

```sh
npm run dev
```

Abre <http://127.0.0.1:4173>. No hace falta ejecutar `npm install`: el proyecto utiliza las bibliotecas incluidas en Node.js. Para detener el servidor, presiona `Ctrl+C` en la terminal.

También puedes abrir `index.html` directamente para revisar la interfaz. Para trabajar con adjuntos, almacenamiento y permisos de notificaciones, utiliza el servidor local: el comportamiento de estas funciones puede variar con direcciones `file://`.

## Funciones

- **Identificación:** nombre de la mercancía, componentes, número ONU opcional y archivo de la ficha de datos de seguridad (FDS).
- **Clasificación orientativa:** consulta de un catálogo limitado de referencias ONU, clase, riesgos, etiquetas y grupo de embalaje cuando corresponde.
- **Documentación y permisos:** preparación de documentos a revisar según la mercancía, operación y destino; incluye DGD, FDS y documentación de transporte.
- **Checklist:** seguimiento de documentos disponibles y pendientes, con observaciones y fechas cuando corresponda.
- **Guía de seguridad:** información general sobre manipulación, almacenamiento, embalaje, etiquetado y segregación.
- **Alertas:** pendientes y vencimientos visibles en la aplicación, con notificaciones del navegador cuando este lo permite y el usuario las autoriza.

Los datos de texto se guardan en `localStorage` del navegador. Los archivos FDS en PDF o TXT, de hasta 10 MiB, se guardan en IndexedDB del mismo navegador. El almacenamiento pertenece a ese dispositivo, perfil y dirección web; no se sincroniza entre usuarios ni dispositivos. Borrar los datos del navegador también borra esta información. Un cambio de dirección —por ejemplo, pasar de localhost a GitHub Pages— crea un espacio de almacenamiento diferente.

La exportación JSON permite conservar los datos de la operación, pero **no incluye los bytes de los adjuntos**. Guarda también una copia de tus archivos originales.

## Alcance de la orientación

La aplicación es una herramienta de organización y consulta, no una certificación de cumplimiento ni un motor de clasificación oficial. El catálogo es limitado. Una coincidencia por nombre no determina la clasificación de una mezcla: composición, concentración, estado y condiciones de transporte pueden cambiar la entrada aplicable.

Adjuntar una FDS no implica que la aplicación la lea o extraiga sus datos automáticamente. Revisa especialmente su sección 14 y confirma la información con personal competente, el transportista y la normativa aplicable. No se utiliza un servicio de IA para interpretar archivos.

La referencia normativa es el **Código IMDG, edición 2024, enmienda 42-24, obligatoria desde el 1 de enero de 2026**. La aplicación incluye enlaces a fuentes primarias de la Organización Marítima Internacional y otras referencias oficiales. Los permisos concretos dependen del producto, la operación, el país de origen, el destino y las autoridades competentes.

No hay backend, envío de correos ni notificaciones push con la página cerrada. Las alertas se revisan mientras la aplicación está abierta y al volver a abrirla. No se asigna a la FDS una caducidad universal: registra las fechas que realmente correspondan a tus documentos.

## Verificar y preparar publicación

```sh
npm run check
npm run build
```

El primer comando revisa la sintaxis y ejecuta las pruebas del proyecto. El segundo copia únicamente los archivos públicos y los recursos permitidos a `dist/`; no publica documentos locales, skills ni archivos de configuración privados.

## Publicar en GitHub Pages

La vista de Sites que se entregue junto al proyecto es privada para su propietario. Esa vista permite revisar el resultado, pero no equivale a publicar el repositorio en GitHub Pages. Para obtener una página pública compartible desde GitHub, completa los pasos siguientes.

1. Crea un repositorio en GitHub y sube el contenido de esta carpeta a la rama `main`, incluyendo `.github/workflows/deploy.yml`. Conserva las rutas relativas de los archivos.
2. En el repositorio, entra en **Settings → Pages** y selecciona **GitHub Actions** como origen de publicación.
3. Abre **Actions → Publicar en GitHub Pages → Run workflow**, o realiza un nuevo cambio en `main`.
4. Cuando terminen las tareas `build` y `deploy`, GitHub mostrará la dirección publicada en **Settings → Pages** y en el despliegue `github-pages`.
5. Comparte esa dirección con quienes deban usar la aplicación. Cada persona tendrá sus propios datos en su navegador.

El flujo incluye verificaciones antes de publicar. Si tu rama principal tiene otro nombre, cambia `branches: [main]` en el workflow. La disponibilidad de GitHub Pages para repositorios privados depende de tu cuenta de GitHub.

También puedes alojar el contenido de `dist/` en cualquier servidor web estático compatible con HTTPS. No necesita claves API, base de datos remota ni un servidor Node.js en producción.

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

Las skills de Emil Kowalski, Impeccable y Taste están incorporadas como recursos del proyecto en `design-skills/`; esto no las instala globalmente en Codex. Sus fuentes y los criterios aplicados se documentan en `DESIGN.md`. Son recursos de desarrollo y no se envían como parte del sitio público.
