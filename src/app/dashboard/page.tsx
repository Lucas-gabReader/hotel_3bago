import { DashboardCard } from "../components/DashboardCard";

export default function DashboardPage() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        <DashboardCard title="Hóspedes" value={120} />
        <DashboardCard title="Reservas Ativas" value={35} />
        <DashboardCard title="Quartos Disponíveis" value={18} />
        <DashboardCard title="Faturamento" value="R$ 12.500" />
      </div>
    );
  }