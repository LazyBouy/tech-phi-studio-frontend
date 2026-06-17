import type { Metadata } from "next";
import { Work_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MswInit } from "@/mocks/MswInit";
import { Providers } from "@/app/providers";
import { AnimationProvider } from "@/animations/scroll-smoother";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

// Work Sans = body/UI face (Figma). Variable font, self-hosted by next/font.
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${workSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MswInit />
        <Providers>
          {/* Nav sits OUTSIDE the smoother so position:fixed isn't broken by its transform (CH-06/07). */}
          <Navigation />
          <AnimationProvider>
            {children}
            <Footer />
          </AnimationProvider>
        </Providers>
      </body>
    </html>
  );
}
