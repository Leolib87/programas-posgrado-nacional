export const CATEGORICAL_LIGHT = ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948'];
export const CATEGORICAL_DARK = ['#3987e5', '#199e70', '#c98500', '#008300', '#9085e9', '#e66767'];

export const MODALIDAD_COLOR_LIGHT: Record<string, string> = {
  Presencial: CATEGORICAL_LIGHT[0],
  Online: CATEGORICAL_LIGHT[1],
  Híbrida: CATEGORICAL_LIGHT[2],
};
export const MODALIDAD_COLOR_DARK: Record<string, string> = {
  Presencial: CATEGORICAL_DARK[0],
  Online: CATEGORICAL_DARK[1],
  Híbrida: CATEGORICAL_DARK[2],
};

export const TIPO_COLOR_LIGHT: Record<string, string> = {
  Pública: CATEGORICAL_LIGHT[0],
  Privada: CATEGORICAL_LIGHT[1],
};
export const TIPO_COLOR_DARK: Record<string, string> = {
  Pública: CATEGORICAL_DARK[0],
  Privada: CATEGORICAL_DARK[1],
};

export const SEQUENTIAL_BLUE_LIGHT = ['#cde2fb', '#9ec5f4', '#5598e7', '#2a78d6', '#184f95'];
export const SEQUENTIAL_BLUE_DARK = ['#184f95', '#256abf', '#2a78d6', '#5598e7', '#9ec5f4'];

export const INK_LIGHT = {
  primary: '#0b0b0b',
  secondary: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
  baseline: '#c3c2b7',
  surface: '#fcfcfb',
};

export const INK_DARK = {
  primary: '#f5f5f4',
  secondary: '#c3c2b7',
  muted: '#8b8b86',
  grid: '#2c2c2a',
  baseline: '#3f3f3d',
  surface: '#17181c',
};

export function chartPalette(isDark: boolean) {
  return {
    ink: isDark ? INK_DARK : INK_LIGHT,
    categorical: isDark ? CATEGORICAL_DARK : CATEGORICAL_LIGHT,
    modalidadColor: isDark ? MODALIDAD_COLOR_DARK : MODALIDAD_COLOR_LIGHT,
    tipoColor: isDark ? TIPO_COLOR_DARK : TIPO_COLOR_LIGHT,
    sequentialBlue: isDark ? SEQUENTIAL_BLUE_DARK : SEQUENTIAL_BLUE_LIGHT,
  };
}
