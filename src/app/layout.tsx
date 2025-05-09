import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Topbar from "@/components/topbar";
import { Toaster } from "sonner";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krisefikser",
  description: "Se kriser og øk beredskapsnivået ditt",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col md:pb-0 pb-13`}>
        <Providers>
          <Topbar />
          {children}
          <Toaster />
          <div className="flex-1 min-h-10 relative w-full">
            <footer className="absolute bottom-0 justify-center flex items-center bg-gray-100 text-gray-700 p-4 gap-10 w-full">
              <span>© {new Date().getFullYear()} Krisefikser™</span>
              <Link href="/privacy-policy" className="text-blue-700 hover:underline">
                Personvernerklæring
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
