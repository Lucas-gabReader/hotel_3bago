"use client"

import Link from "next/link";   
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="bg-white shadow-md p-4 flex gap-6 justify-center sticky top-0 z-50">
          <Link href="/" className="hover:text-blue-600 font-medium">Início</Link>
          {user ? (
            <>
              <Link href="/hotels" className="hover:text-blue-600 font-medium">Hotéis</Link>
              <Link href="/quartos" className="hover:text-blue-600 font-medium">Quartos</Link>
              <Link href="/reservas" className="hover:text-blue-600 font-medium">Reservas</Link>
            </>
          ) : null}
          {!user ? (
            <>
              <Link href="/register" className="hover:text-blue-600 font-medium">Registrar</Link>
              <Link href="/login" className="hover:text-blue-600 font-medium">Login</Link>
            </>
          ) : null}
        </nav>
    );
}
