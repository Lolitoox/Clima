# 🌦️ Weather App (Clima)

Una aplicación web moderna y minimalista para consultar el clima en tiempo real, desarrollada con **Vanilla JavaScript** y diseño **Glassmorphism**.

## ✨ Características

- **Geolocalización Automática**: Detecta tu ubicación actual al instante.
- **Búsqueda Mundial**: Encuentra el clima de cualquier ciudad del mundo.
- **Pronósticos Detallados**:
  - Clima actual con sensación térmica, humedad, viento y UV.
  - **Lluvia**: Milímetros esperados y probabilidad (%) en tiempo real.
  - Pronóstico por hora (24h) y extendido a 7 días.
- **Diseño Dinámico**:
  - Fondo animado que cambia según la hora (día/noche/atardecer).
  - Efectos visuales para lluvia, nieve, niebla y tormentas.
  - Iconos SVG vectoriales nítidos en cualquier resolución.
- **API Open Source**: Utiliza [Open-Meteo](https://open-meteo.com/) y [Nominatim](https://nominatim.org/) (OpenStreetMap), sin necesidad de API Keys.

## 🚀 Tecnologías

- **HTML5** Semántico
- **CSS3** Moderno (Variables, Flexbox, Grid, Animaciones, Glassmorphism)
- **JavaScript** (ES6+), Fetch API, Geolocalización
- **APIs**: Open-Meteo Weather API, Nominatim Geocoding API

## 📦 Instalación

No requiere instalación ni dependencias (como `npm` o `node_modules`). Es una aplicación web nativa pura.

1. Clona este repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/weather-app.git
   ```
2. Abre el archivo `index.html` en tu navegador.
3. ¡Listo!

## 🌐 Despliegue en GitHub Pages

Este proyecto está optimizado para funcionar directamente en GitHub Pages:

1. Ve a la pestaña **Settings** de tu repositorio en GitHub.
2. Selecciona **Pages** en el menú lateral izquierdo.
3. En **Source**, elige `Deploy from a branch`.
4. Selecciona la rama `main` (o `master`) y la carpeta `/root`.
5. Guarda los cambios. En unos minutos tu app estará online.
