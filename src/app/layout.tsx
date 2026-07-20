import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "AI API Generator — Ship backends in seconds",
    template: "%s · AI API Generator",
  },
  description:
    "Turn SQL, Prisma, Mongoose schemas or plain English into a complete, production-ready backend — models, CRUD APIs, auth, validation, docs and tests.",
  keywords: [
    "AI",
    "backend generator",
    "API generator",
    "Prisma",
    "Mongoose",
    "Express",
    "Next.js",
  ],
  authors: [{ name: "AI API Generator" }],
  openGraph: {
    title: "AI API Generator",
    description:
      "Turn schemas or plain English into a complete production-ready backend.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
