import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  title: "Your Studio — Design, Illustration & Visual",
  description:
    "A multidisciplinary design portfolio showcasing product design, visual works, graphic design, and illustration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}