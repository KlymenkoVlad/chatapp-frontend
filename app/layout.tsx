import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import Footer from "@/components/common/LayoutComponents/Footer";
import Header from "@/components/common/LayoutComponents/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description:
    "Really cool chat app, just for fun and learning, but you can use it",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*Delete adding class below h-screen*/

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Toaster richColors position="top-center" />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
