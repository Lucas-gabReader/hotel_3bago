"use client"

import Link from "next/link";   
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <motion.nav
        className="bg-white shadow-md p-4 flex gap-6 justify-center sticky top-0 z-50"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <Link href="/" className="hover:text-blue-600 font-medium">Início</Link>
      <Link href="/hotels" className="hover:text-blue-600 font-medium">Hotéis</Link>
      <Link href="/rooms" className="hover:text-blue-600 font-medium">Quartos</Link>
      <Link href="/reservas" className="hover:text-blue-600 font-medium">Reservas</Link>
    </motion.nav>
);
}