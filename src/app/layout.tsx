import type { Metadata } from "next";
import "./globals.css";
import TopHeader from "@/components/Header/TopHeader/page";
import Header from "@/components/Header/NormalHeader/page";
import { Footer } from "@/components/Footer/page";
import { ApplicationConfig } from "@/config/ApplicationConfig";

 
 

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
      <head>
      <link
          href="https://fonts.googleapis.com/css2?family=Yrsa:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`font-sans`}
      >
        <TopHeader/>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
