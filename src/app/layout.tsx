import type { Metadata } from "next";
import "./globals.css";
import TopHeader from "@/components/Header/TopHeader/page";
import { Footer } from "@/components/Footer/page";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import HomeLayout from "./home/layout";
import FacebookPixel from "@/components/FacebookPixel/FacebookPixel";

const metadata: Metadata = {
  title: "Apni Maati Vastram - Modern Comfort in Traditional Sarees & Accessories",
  description:
    "Buy Online Ready-to-wear sarees | 1 min saree | Pre-pleated sarees | Traditional sarees | Blouses & earrings | Quality sarees at genuine pricing | COD available | All India shipping",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
    <head>
        {/* Ensure title is a string */}
        <title>{String(metadata.title)}</title>
        {/* Ensure description is a string */}
        <meta name="description" content={String(metadata.description || "")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Yrsa:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-sans">
        <FacebookPixel/>
        <ToastContainer />
        <TopHeader />
        <HomeLayout>{children}</HomeLayout>
        <Footer />
      </body>
    </html>
  );
}
