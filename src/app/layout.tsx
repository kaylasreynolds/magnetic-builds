import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "./theme-toggle";

export const metadata: Metadata = { title: "Magnetic Builds", description: "A workspace for real magnetic tile builds." };

const themeScript = `
(() => {
  try {
    const saved = localStorage.getItem("magnetic-builds-theme");
    const theme = saved === "light" || saved === "dark"
      ? saved
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header>
          <div className="site-header-inner">
            <strong>Magnetic Builds</strong>
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
