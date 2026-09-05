import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Magnetic Builds", description: "A workspace for real magnetic tile builds." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header><strong>Magnetic Builds</strong></header><main>{children}</main></body></html>;
}
