import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { ThemeContext } from "@atlas/ui-native/theme/context";
import type { ColorScheme, ThemeContextValue } from "@atlas/ui-native/theme";
import atlasTokens from "@atlas/ui-native/tokens";

import { atlasDarkTheme, atlasLightTheme, dark as appDark, light as appLight } from "./theme";
import { textRoles } from "./typography";

/**
 * Single injection point for the app's design-system override layer
 * (ADR-012). Wraps Atlas's `ThemeContext` directly (not Atlas's own
 * `ThemeProvider`) so the overridden palette in `theme.ts` reaches every
 * Atlas component via `useTheme()`, while also exposing the app's semantic
 * tokens + typography to app-built components via `useAppTheme()`.
 */
export interface AppThemeContextValue {
  colorScheme: ColorScheme;
  colors: typeof appLight;
  textRoles: typeof textRoles;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export interface AppThemeProviderProps {
  children: React.ReactNode;
  /** Force a scheme regardless of system preference (testing / debug toggle). */
  colorScheme?: ColorScheme;
}

export function AppThemeProvider({ children, colorScheme: override }: AppThemeProviderProps) {
  const system = useSystemColorScheme();
  const colorScheme: ColorScheme = override ?? (system === "dark" ? "dark" : "light");

  const atlasValue = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      colors: colorScheme === "dark" ? atlasDarkTheme : atlasLightTheme,
      tokens: atlasTokens,
    }),
    [colorScheme],
  );

  const appValue = useMemo<AppThemeContextValue>(
    () => ({
      colorScheme,
      colors: colorScheme === "dark" ? appDark : appLight,
      textRoles,
    }),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider value={atlasValue}>
      <AppThemeContext.Provider value={appValue}>{children}</AppThemeContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeContextValue {
  const ctx = useContext(AppThemeContext);
  if (ctx === null) {
    throw new Error(
      "[App] useAppTheme() was called outside of an <AppThemeProvider>.\n" +
        "Wrap your app root with <AppThemeProvider> before calling useAppTheme().",
    );
  }
  return ctx;
}
