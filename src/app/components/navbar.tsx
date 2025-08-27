"use client"

import Link from "next/link";   

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md p-4 flex gap-6 justify-center sticky top-0 z-50">
      <Link href="/" className="hover:text-blue-600 font-medium">Início</Link>
      <Link href="/hotels" className="hover:text-blue-600 font-medium">Hotéis</Link>
      <Link href="/quartos" className="hover:text-blue-600 font-medium">Quartos</Link>
      <Link href="/reservas" className="hover:text-blue-600 font-medium">Reservas</Link>
    </nav>
);
}
