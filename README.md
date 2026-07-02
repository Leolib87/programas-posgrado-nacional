# Programas de Posgrado Nacional

Dashboard interactivo de programas de posgrado en Chile, organizado por temática.

## Fase 1 — Doctorados en Educación

Todos los Doctorados en Educación vigentes en Chile (universidades públicas y privadas, modalidad
presencial/online), comparables por arancel, duración, tipo de institución y acreditación, con link directo
al sitio oficial de cada programa.

- Panel de filtros: rango de arancel anual, modalidad, tipo de institución, región.
- Gráficos D3.js: arancel por universidad, distribución por modalidad y tipo de institución, duración vs. arancel.

### Stack

Astro 5 · React (islas) · Tailwind CSS v4 · D3.js · TypeScript

### Desarrollo local

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

Se despliega automáticamente a GitHub Pages en cada push a `main` (`.github/workflows/deploy.yml`).

### Datos

`src/data/doctorados-educacion.json` — cada registro incluye universidad, tipo de institución, ciudad, región,
modalidad, duración, arancel anual, matrícula, acreditación y el link oficial verificado del programa. Los
aranceles y vacantes cambian año a año: verifica siempre en el sitio oficial antes de postular.

### Próximas temáticas

El esquema de datos y la estructura del dashboard están pensados para agregar otras temáticas de doctorado
(`src/data/doctorados-<tematica>.json`) más adelante.
