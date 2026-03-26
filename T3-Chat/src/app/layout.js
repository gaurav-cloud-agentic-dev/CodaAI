import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ClientProviders from "@/modules/chat/client-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CodaAI Chat",
  description: "AI-powered chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('coda-theme');
                var isDark = theme === 'dark';
                var html = document.documentElement;
                html.setAttribute('data-theme', isDark ? 'dark' : 'light');
                html.classList.toggle('dark', isDark);
                html.style.colorScheme = isDark ? 'dark' : 'light';
                html.style.background = isDark ? '#1A1A1A' : '#EBEBEB';
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
        style={{ background: "var(--page-bg)" }}
      >
        <Providers>
          <ClientProviders>
            {children}
          </ClientProviders>
        </Providers>
      </body>
    </html>
  );
}