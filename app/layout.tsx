import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/ParticleBackground";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import { site } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://afrazcreates.vercel.app"),
  title: `${site.name} | Developer Portfolio`,
  description: site.tagline,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: `${site.name} | Developer Portfolio`,
    description: site.tagline,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Developer Portfolio`,
    description: site.tagline,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-slate-200">
        <Preloader />
        <ParticleBackground />
        <CustomCursor />
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  );
}
