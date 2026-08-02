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
        <link rel="dns-prefetch" href="https://static.figma.com" />
        <link rel="preconnect" href="https://static.figma.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.figma.com" />
        <link rel="preconnect" href="https://api.figma.com" crossOrigin="anonymous" />
        <link rel="preload" as="document" href="https://embed.figma.com/proto/fuwUuSdyfemaX4QBdYjHS1/Untitled?page-id=0%3A1&starting-point-node-id=62%3A92&embed-host=share" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
