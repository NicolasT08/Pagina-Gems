# Spec: página de descarga del APK de GEMS

> Instrucciones para Claude Code. Construye una página web estática, de una sola página, para descargar el instalador Android (APK) de **GEMS**. La app se distribuye fuera de Google Play, así que la página tiene que inspirar confianza y explicar bien la instalación manual.

---

## 1. Contexto

- **GEMS** es una app móvil para recolectar datos de campo **geológicos y biológicos**: registros con coordenadas GPS, fotos y fichas descriptivas que se sincronizan con Firebase/Firestore.
- La desarrollan estudiantes de Ingeniería de Sistemas y Computación de la **UPTC, sede Sogamoso**, junto con los grupos de investigación **Citesa** y **Galash**.
- Se ha usado en salidas de campo como la del **lago de Tota (Boyacá)**.
- Los usuarios son investigadores y estudiantes que van a campo. No todos son técnicos, así que hay que explicarles con calma cómo instalar un APK.
- **Presupuesto cero.** Todo tiene que quedar alojado gratis.

## 2. Stack y alojamiento (obligatorio)

- **HTML + CSS + JavaScript puros.** Nada de frameworks ni de paso de build. Debe abrirse haciendo doble clic en `index.html`.
- **Alojamiento:** GitHub Pages desde la rama `main`, carpeta raíz (o `/docs`).
- **El APK NO va dentro del repositorio.** Se sube como asset de un **GitHub Release**, porque GitHub limita los archivos del repo a 100 MB y los releases aceptan hasta 2 GB. El botón de descarga apunta a:
  `https://github.com/<USUARIO>/<REPO>/releases/latest/download/gems.apk`
  Con esta URL fija, cada vez que se publique un release nuevo con un asset llamado `gems.apk`, la página descarga la última versión sin tocar el código.
- Todos los datos que cambian entre versiones van en **un solo objeto de configuración** al inicio de `main.js`:

```js
const CONFIG = {
  appName: "GEMS",
  version: "1.0.0",            // TODO: versión real
  releaseDate: "2026-10-03",   // TODO
  apkSizeMB: 0,                // TODO: tamaño real del APK
  minAndroid: "8.0",           // TODO: según minSdkVersion
  sha256: "",                  // TODO: hash del APK (ver sección 7)
  apkUrl: "https://github.com/<USUARIO>/<REPO>/releases/latest/download/gems.apk",
  releasesUrl: "https://github.com/<USUARIO>/<REPO>/releases",
  contactEmail: "",            // TODO
};
```

  El JS rellena el DOM a partir de `CONFIG`. Si `sha256` está vacío, el bloque de verificación se oculta. Si `apkSizeMB` es 0, no se muestra el tamaño.

## 3. Estructura de archivos

```
/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── logo.svg            # placeholder si no hay logo real
│   ├── favicon.svg
│   ├── og-image.png        # 1200×630 para previsualización al compartir
│   └── screenshots/        # capturas de la app (placeholders mientras tanto)
└── README.md               # cómo publicar una versión nueva
```

## 4. Dirección visual (lo más importante)

La página tiene que verse **cuidada y con identidad propia**, no como una plantilla genérica de landing de apps. Evita los degradados morados, el glassmorphism por defecto, las tarjetas idénticas con íconos de emoji y la tipografía Inter en todo.

**Concepto: "libreta de campo".** Mezcla la estética de un cuaderno de geólogo o bióloga con la de un mapa topográfico.

- **Fondo:** papel cálido (`#F4EFE6` aprox.) con **curvas de nivel topográficas** muy sutiles hechas en SVG inline, como textura del hero. En una de las curvas se puede marcar un punto con coordenadas reales del lago de Tota (≈ 5.54° N, 72.93° O) como detalle.
- **Paleta** (definir como variables CSS en `:root`):
  - `--paper` #F4EFE6 (fondo)
  - `--ink` #1F2A24 (texto principal, verde casi negro)
  - `--moss` #3F6B4E (acento biológico, botón principal)
  - `--ochre` #C08A3E (acento geológico, detalles)
  - `--stone` #8A8578 (texto secundario)
  - `--line` #D9D0C1 (bordes y curvas de nivel)
- **Tipografía** (Google Fonts):
  - Títulos: **Fraunces** (serif con carácter), con pesos 600–700 en el hero.
  - Texto: **IBM Plex Sans**.
  - Datos técnicos (versión, tamaño, SHA-256, coordenadas): **IBM Plex Mono**, como etiquetas de muestra de campo.
- **Detalles de identidad:**
  - Las secciones se numeran como fichas de muestra: `01 — Descarga`, `02 — Instalación`…
  - Las tarjetas de características parecen **etiquetas de muestra** (borde fino, esquina superior con un código tipo `GEO-01` / `BIO-02` en mono).
  - Mockup de teléfono hecho en CSS con una captura dentro, ligeramente rotado (−3°), en el hero.
- **Movimiento:** discreto. Las curvas de nivel aparecen al cargar (animación de `stroke-dashoffset`) y las secciones hacen fade-in al hacer scroll con `IntersectionObserver`. Todo se desactiva con `prefers-reduced-motion`.
- **Modo oscuro:** soportar `prefers-color-scheme: dark` con una paleta de "libreta de noche": fondo `#151B17`, texto `#E9E3D6`, el musgo y el ocre un poco más claros.

## 5. Contenido y secciones (en español)

1. **Encabezado:** logo + "GEMS" y enlaces ancla a Descarga, Instalación y Preguntas. En móvil se reduce a logo + botón "Descargar".

2. **Hero:**
   - Título: *"Tu libreta de campo, en el bolsillo."* (puede proponer alternativas en un comentario)
   - Subtítulo: *"Registra datos geológicos y biológicos con ubicación GPS, fotos y fichas descriptivas, incluso cuando estás lejos de todo."*
   - **Botón principal grande:** "Descargar para Android" + ícono de descarga, y debajo, en mono: `v1.0.0 · 24 MB · Android 8.0+` (todo desde `CONFIG`).
   - Enlace secundario: "¿Cómo se instala?", que lleva a la sección de instalación.
   - Mockup del teléfono a la derecha (debajo en móvil).

3. **Qué hace GEMS:** 3–4 tarjetas-etiqueta. Ejemplos (ajustar si algo no aplica):
   - `GEO` Registro de afloramientos y muestras geológicas.
   - `BIO` Registro de especies y observaciones biológicas.
   - `GPS` Cada registro queda georreferenciado.
   - `SYNC` Sincronización con la base de datos del grupo de investigación.

4. **Capturas:** carrusel horizontal con scroll-snap de 3–5 capturas, sin librerías. Usar placeholders con proporción 9:19.5 hasta que haya capturas reales.

5. **Instalación paso a paso:** es la sección que más importa, porque el APK no viene de Play Store. Cuatro pasos numerados con texto claro:
   1. Descarga el archivo `gems.apk` desde el botón de arriba.
   2. Ábrelo desde las notificaciones o desde la carpeta Descargas.
   3. Si Android lo pide, permite **"Instalar apps desconocidas"** para el navegador o el gestor de archivos. Explicar que este permiso se da a una app concreta y que luego se puede quitar.
   4. Si aparece un aviso de **Google Play Protect**, toca "Más detalles" → "Instalar de todas formas". Explicar con honestidad por qué pasa: la app no está publicada en Play Store, y eso no significa que tenga algo malo.
   - Incluir una nota sobre **cómo actualizar**: se descarga el APK nuevo y se instala encima, sin perder datos (TODO: confirmar con el equipo que es así).

6. **Verificación (opcional, solo si hay `sha256`):** caja con el hash en mono y un botón "Copiar" (usar `navigator.clipboard` y un feedback "¡Copiado!"). Añadir una línea para usuarios técnicos sobre cómo verificarlo.

7. **Preguntas frecuentes:** usar `<details>/<summary>` nativos con estilo propio.
   - ¿Por qué no está en Play Store? → Es un proyecto académico de la UPTC sin presupuesto para la cuenta de desarrollador.
   - ¿Es seguro? → Código del grupo de investigación, se puede verificar el hash.
   - ¿Funciona en iPhone? → Por ahora solo Android.
   - ¿Necesito internet en campo? → TODO: confirmar el comportamiento sin conexión.
   - ¿Dónde se guardan mis datos? → En la base de datos del grupo de investigación (Firebase).

8. **Pie de página:** "Desarrollado en la Universidad Pedagógica y Tecnológica de Colombia — Sede Sogamoso", grupos Citesa y Galash, enlace a todas las versiones (`releasesUrl`), contacto y año.

## 6. Requisitos no funcionales

- **Responsive mobile-first.** La mayoría va a abrir la página **desde el celular** donde instalarán la app. A 360 px de ancho, el botón de descarga debe verse sin hacer scroll.
- **Detección de dispositivo:** si el visitante está en iOS, mostrar un aviso amable de que GEMS solo está para Android. Si está en escritorio, mostrar junto al botón un **código QR** generado en el cliente (con una librería pequeña desde cdnjs, o un SVG pre-generado) que apunte a la URL de la página, para abrirla desde el teléfono.
- **Rendimiento:** página ligera (< 300 KB sin capturas), imágenes en WebP con `loading="lazy"` y fuentes con `display=swap`.
- **Accesibilidad:** HTML semántico, contraste AA, foco visible en todos los elementos interactivos, `alt` en las imágenes y el botón de descarga como `<a href download>` real (no un `div` con JS).
- **SEO / compartir:** `<title>`, meta description, Open Graph y `lang="es"`. Que se vea bien al compartir el enlace por WhatsApp.
- Sin cookies, sin analítica y sin rastreadores.

## 7. README.md que debe generar

Un README corto en español con:
1. Cómo activar GitHub Pages (Settings → Pages → rama `main`).
2. **Cómo publicar una versión nueva:**
   - Generar el APK firmado de release.
   - Renombrarlo exactamente a `gems.apk`.
   - En GitHub: Releases → *Draft a new release* → tag `v1.0.1` → adjuntar `gems.apk` → Publicar.
   - Actualizar `version`, `releaseDate`, `apkSizeMB` y `sha256` en `CONFIG`.
   - Comando para obtener el hash:
     - Windows (PowerShell): `Get-FileHash gems.apk -Algorithm SHA256`
     - Linux/macOS: `sha256sum gems.apk`
3. Cómo reemplazar las capturas y el logo.

## 8. Criterios de aceptación

- [ ] `index.html` abre localmente sin servidor y sin errores en consola.
- [ ] El botón de descarga apunta a `releases/latest/download/gems.apk`.
- [ ] Versión, tamaño, Android mínimo y hash se leen de `CONFIG` y se ocultan si están vacíos.
- [ ] Se ve bien a 360 px, 768 px y 1440 px, sin scroll horizontal.
- [ ] Modo claro y oscuro funcionan y tienen contraste AA.
- [ ] En iOS se ve el aviso y en escritorio el QR.
- [ ] Las animaciones respetan `prefers-reduced-motion`.
- [ ] La sección de instalación explica "apps desconocidas" y Play Protect.
- [ ] Existe un README con el flujo de publicación de versiones.
- [ ] Todos los datos pendientes están marcados con `TODO` para que el equipo los complete.

## 9. Fuera de alcance

Backend, inicio de sesión, contador de descargas, versión en inglés y CMS.