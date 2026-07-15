# Detrás de las Cifras
### Radiografía de la Crisis Laboral como Detonante de la Inseguridad en Ecuador

Proyecto de visualización de datos tipo **scrollytelling** que analiza la evolución del empleo adecuado, la informalidad laboral, la deserción educativa y los homicidios intencionales en Ecuador entre 2007 y 2025, a partir de datos oficiales del INEC, el Ministerio del Interior y el Ministerio de Educación.

![Ecuador 2007–2026](https://img.shields.io/badge/Periodo-2007--2026-00f5cc?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)

---

## 📖 Sobre el proyecto

"Detrás de las Cifras" cuenta, capítulo a capítulo, la evolución paralela de dos crisis en Ecuador: el deterioro progresivo del mercado laboral formal y el aumento sostenido de la violencia homicida. La narrativa avanza mediante scroll horizontal, combinando gráficos interactivos, un mapa coroplético del país y un simulador de cruce de variables, para que el lector explore los datos por sí mismo en vez de solo leerlos.

> **Nota metodológica:** el proyecto identifica evolución paralela y coexistencia temporal entre ambos fenómenos a partir de series agregadas nacionales y provinciales — no establece una relación causal comprobada estadísticamente. Otros factores no abordados aquí (narcotráfico, control territorial, capacidad institucional, entre otros) también inciden en la dinámica de la inseguridad en Ecuador. Esta aclaración está incluida de forma visible dentro de la propia aplicación, en la sección de créditos.

## 🗺️ Estructura de la historia

| # | Sección | Periodo | Contenido |
|---|---|---|---|
| 0 | Intro | 2007–2026 | Presentación del proyecto y la pregunta de investigación |
| 1 | El Escudo Social | 2007–2016 | Fortalecimiento progresivo del empleo adecuado y descenso de homicidios |
| 2 | Grietas Silenciosas | 2017–2019 | Primeras señales de deterioro del mercado laboral formal |
| 3 | El Gran Shock | 2020 | Impacto de la pandemia en el empleo (comparativa 2018–2020) |
| 4 | El Año Más Violento | 2020–2025 | Escalada de homicidios hasta el récord histórico de 2025 |
| 5 | Zonas en Alerta Roja | 2025 | Mapa interactivo de homicidios por provincia y cantón |
| 6 | Cruce de Variables | 2020–2025 | Simulador comparativo normalizado de homicidios, informalidad y deserción educativa |
| 7 | Créditos | — | Ficha académica y nota metodológica |

## 🛠️ Stack técnico

- **[React 19](https://react.dev/)** + **[Vite](https://vitejs.dev/)** — base de la aplicación
- **[GSAP](https://gsap.com/) + ScrollTrigger** — timeline maestro que controla la narrativa scrollytelling
- **[Lenis](https://lenis.darkroom.engineering/)** — scroll inercial suave, sincronizado con GSAP
- **[Framer Motion](https://www.framer.com/motion/)** — animaciones de entrada declarativas (Intro, Créditos)
- **[anime.js v4](https://animejs.com/)** — animaciones de conteo numérico y transiciones de texto
- **[Split Type](https://github.com/lukePeavey/SplitType)** — animación de títulos letra por letra en los capítulos de mayor peso narrativo
- **[ApexCharts](https://apexcharts.com/)** (vía `react-apexcharts`) — todos los gráficos de datos
- SVG a medida con `viewBox` para el mapa coroplético de Ecuador (sin librería de mapas externa)

## 📊 Fuentes de datos

- **Empleo, subempleo e informalidad:** INEC — Encuesta Nacional de Empleo, Desempleo y Subempleo (ENEMDU)
- **Homicidios intencionales (nacional, provincial y cantonal):** Ministerio del Interior del Ecuador, sistematizados por el Observatorio Ecuatoriano de Crimen Organizado (OECO-PADF)
- **Deserción escolar:** Ministerio de Educación del Ecuador

Los puntos donde no se encontró una cifra oficial verificable a nivel cantonal se dejaron explícitamente marcados como estimados dentro de la propia interfaz, o se generalizaron a nivel provincial en vez de presentarse como dato exacto.

## 🚀 Cómo correrlo localmente

```bash
# Clonar el repositorio
git clone https://github.com/joaoelian204/Visualizacion-CasaAbierta-main.git
cd Visualizacion-CasaAbierta-main

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Previsualizar el build de producción
npm run preview

# Lint
npm run lint
```

Requiere Node.js 18 o superior.

## 📱 Responsive

El proyecto está adaptado para móvil, tablet, laptop, monitor de escritorio y pantallas grandes (TV / 4K), con breakpoints en 640px, 899px, 1199px y 1920px. En pantallas angostas, el layout de dos columnas (texto + gráfico) se apila verticalmente y los gráficos ajustan su altura automáticamente.

## 🎓 Créditos académicos

**Unidad Académica:** Facultad de Ciencias de la Vida y Tecnología
**Carrera:** Software
**Asignatura:** Visualización de Datos — 6to Semestre
**Docente:** Anthony Legarda

**Integrantes:**
- Carlos Valencia
- Joao Moreira
- Steven Magallanes
- David Jaramillo

## 📄 Licencia

Proyecto académico desarrollado con fines educativos.
