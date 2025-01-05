import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopHeader from "@/components/Header/TopHeader/page";
import Header from "@/components/Header/NormalHeader/page";
import { Footer } from "@/components/Footer/page";
import { ApplicationConfig } from "@/config/ApplicationConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: ApplicationConfig.applicationName,
  description:  ApplicationConfig.applicationName,
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
        <TopHeader/>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
