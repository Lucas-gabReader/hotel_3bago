import { ReactNode } from "react";
import "./globals.css";
import {Inter } from "next/font/google";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"]});

export const metadata = {
  title: "Sistema de Hotéis",
  description: "Gerenciamento de hotéis, quartos e reservas",
};

export default function RootLayout({ children}: { children: ReactNode}) {
    return (
      <html lang="pt-BR">
        <body className={`${inter.className} bg-gray-50 text-gray-900`}>
          <Navbar />
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </body>
      </html>
    );
}