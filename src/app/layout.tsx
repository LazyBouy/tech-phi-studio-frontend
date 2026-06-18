import type { Metadata } from "next";
import { Work_Sans, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { MswInit } from "@/mocks/MswInit";
import { Providers } from "@/app/providers";
import { AnimationProvider } from "@/animations/scroll-smoother";
import { Navigation } from "@/components/layout/Navigation";
// Footer (CH-07) is intentionally NOT rendered — it is being rebuilt fresh as part of the
// Global-chrome rebuild (Nav · Footer · CTA atom). Re-add once the new Footer is built.

// Work Sans = body/UI face (Figma). Variable font, self-hosted by next/font.
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand display faces (self-hosted from the licensed brand files). Only the two cuts the
// design actually uses are loaded: Satoshi Medium (🖥️/📱 Header H1–H4 Medium) and Ivar Text
// Italic (Header H*-Italic + Big text + B*-Italic). Consumed via --font-display / --font-serif.
const satoshi = localFont({
  src: "../fonts/Satoshi-Medium.woff2",
  variable: "--font-satoshi",
  weight: "500",
  display: "swap",
});

const ivar = localFont({
  src: "../fonts/IvarText-Italic.woff2",
  variable: "--font-ivar",
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tech Philosophy",
  description: "Tech Philosophy — a studio engineering with philosophy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${geistMono.variable} ${satoshi.variable} ${ivar.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MswInit />
        <Providers>
          {/* Nav sits OUTSIDE the smoother so position:fixed isn't broken by its transform (CH-06/07). */}
          <Navigation />
          <AnimationProvider>{children}</AnimationProvider>
        </Providers>
      </body>
    </html>
  );
}
