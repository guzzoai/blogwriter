import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Menu, Home, PenSquare, LayoutDashboard } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEO Affiliate Blog Generator",
  description: "Generate high-quality SEO-optimized blog posts for affiliate marketing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <nav className="w-64 bg-gray-900 text-white p-4">
            <div className="mb-8">
              <h1 className="text-xl font-bold">SEO Blog Generator</h1>
              <p className="text-gray-400 text-sm">Powered by Gemini 2.5 Pro</p>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex items-center p-2 rounded hover:bg-gray-800">
                  <Home className="mr-2 h-5 w-5" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/create" className="flex items-center p-2 rounded hover:bg-gray-800">
                  <PenSquare className="mr-2 h-5 w-5" />
                  Create Blog Post
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-800">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
          <main className="flex-1 p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
