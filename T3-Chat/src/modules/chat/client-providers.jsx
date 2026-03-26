"use client";

import { LanguageProvider } from "./LanguageSettings";
import { ThemeProvider } from "./theme-context";

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}