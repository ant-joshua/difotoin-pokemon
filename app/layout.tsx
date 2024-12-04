import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Difotoin - Pokemon",
  description: "Pokemon app built with NextJS and TailwindCSS for Difotoin.id",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
