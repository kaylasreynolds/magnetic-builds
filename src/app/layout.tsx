import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import favicon from "../../assets/logos/tileable_favicon.png";
import appIcon from "../../assets/logos/tileable_icon.png";
import logo from "../../assets/logos/tileable_logo.png";
import "./globals.css";
import ThemeToggle from "./theme-toggle";

export const metadata: Metadata = {
  title: "Tileable | Magnetic Tile Builds",
  description: "Discover magnetic tile builds, track your collection, and explore what you can create with the tiles you own.",
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: appIcon.src,
  },
};

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
            <Link className="site-brand" href="/" aria-label="Tileable home">
              <Image src={logo} alt="Tileable" priority style={{ width: "auto", height: "2rem", display: "block" }} />
            </Link>
            <nav aria-label="Primary navigation"><Link href="/collection">Collection</Link><Link href="/builds">My Builds</Link><Link href="/studio">Studio</Link></nav>
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
