declare module 'next-themes/dist/types' {
  type Attribute = 'class' | 'data-theme' | 'data-mode'
  
  export interface ThemeProviderProps {
    attribute?: Attribute | Attribute[]
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