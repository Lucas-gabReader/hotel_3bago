import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Sistema de Hotéis</h1>
      <p className="text-gray-600 mb-6">
        Gerencie hotéis, quartos e reservas de forma simples e rápida.
      </p>
      <Link href="/hotels">
        <Button className="rounded-2xl px-6 py-3 text-lg">Explorar Hotéis</Button>
      </Link>
    </div>
  );
}
