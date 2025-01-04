declare module 'next-themes/dist/types' {
  export interface ThemeProviderProps {
    attribute?: string
    defaultTheme?: string
    storageKey?: string
    enableSystem?: boolean
    enableColorScheme?: boolean
    forcedTheme?: string
    disableTransitionOnChange?: boolean
    themes?: string[]
    children?: React.ReactNode
  }
}