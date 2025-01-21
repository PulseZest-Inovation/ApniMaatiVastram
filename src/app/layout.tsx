import type { Metadata } from "next";
import "./globals.css";
import TopHeader from "@/components/Header/TopHeader/page";
import Header from "@/components/Header/NormalHeader/page";
import { Footer } from "@/components/Footer/page";

 
 

export const metadata: Metadata = {
  title:  "Apni Maati Vastram - Modern Comfort in Traditional Sarees & Accessories",
  description:   "Buy Online Ready-to-wear sarees | 1 min saree | Pre-pleated sarees | Traditional sarees | Blouses & earrings | Quality sarees at genuine pricing | COD available | All India shipping",
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
