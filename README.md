# GEMS — página de descarga

Página web para descargar **GEMS**, la app Android de la UPTC Sogamoso, desarrollada con los grupos de investigación Citesa y Galash, para registrar datos geológicos y biológicos en campo con ubicación GPS, fotos y fichas descriptivas.

La página incluye la descarga del APK, las funciones de la app, capturas de pantalla, una guía de instalación paso a paso, la verificación del archivo con SHA-256 y preguntas frecuentes.

Está hecha con HTML, CSS y JavaScript, sin dependencias ni proceso de build.

## Publicar en Render

El repositorio incluye `render.yaml` para desplegar la página como **Static Site**. No necesita instalar Node, ejecutar un build ni configurar variables de entorno.

1. En Render, selecciona **New > Blueprint**.
2. Conecta el repositorio `NicolasT08/Pagina-Gems`.
3. Confirma el blueprint. El servicio se creará con el nombre `gems`.
4. Cuando termine el despliegue, abre **Settings > Custom Domains** o la URL pública del servicio.

La URL gratuita será `https://gems.onrender.com` si ese subdominio está disponible. Si ya está ocupado, Render asignará otra URL; se puede cambiar el nombre del servicio desde **Settings** y volver a desplegar. No hace falta comprar un dominio.
