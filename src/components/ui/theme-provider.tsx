
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define the Attribute type to match what next-themes expects
type Attribute = "class" | "data-theme" | "data-mode" | "style" | "media";

// Define our own ThemeProviderProps type with the correct attribute type
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  forcedTheme?: string;
  attribute?: Attribute | Attribute[];
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
