"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We use React.ComponentProps to dynamically get the types from the provider itself
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}