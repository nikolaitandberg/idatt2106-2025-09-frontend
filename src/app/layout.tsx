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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col md:pb-0 pb-14`}>
        <Providers>
          <Topbar />
          {children}
          <Toaster />
          <footer className="text-sm w-full flex justify-center items-center bg-gray-100 text-gray-700 p-4 gap-10">
            <span>© {new Date().getFullYear()} Krisefikser™.</span>
            <Link href="/privacy-policy" className="text-blue-700 hover:underline">
              Personvernerklæring
            </Link>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
