export const colors = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  tertiary: "var(--color-tertiary)",
  danger: "var(--color-danger)",
  quaternary: "var(--color-quaternary)",
  quinary: "var(--color-quinary)",
  senary: "var(--color-senary)",
  septenary: "var(--color-septenary)",
  white: "var(--color-white)",
} as const;

export const spacing = {
  xxs: "var(--spacing-xxs)",
  xs: "var(--spacing-xs)",
  sm: "var(--spacing-sm)",
  md: "var(--spacing-md)",
  lg: "var(--spacing-lg)",
  xl: "var(--spacing-xl)",
} as const;

export const typography = {
  fontFamily: "var(--font-family)",
  heading: "var(--font-size-heading)",
  body: "var(--font-size-body)",
  caption: "var(--font-size-caption)",
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type TypographyToken = keyof typeof typography;
