import type { Metadata, Viewport } from "next";
import { cairo, jakarta } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Dreamer · حالم صغير",
  description: "Watch your child's imagination come to life in one AI-generated adventure photo.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${cairo.variable} ${jakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
