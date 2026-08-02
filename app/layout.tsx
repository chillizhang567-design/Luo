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
      <head>
        <link rel="dns-prefetch" href="https://embed.figma.com" />
        <link rel="preconnect" href="https://embed.figma.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.figma.com" />
        <link rel="preconnect" href="https://www.figma.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
