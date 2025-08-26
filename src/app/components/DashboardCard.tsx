import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface DashboardCardProps {
    title: string;
    value: string | number;
}

export function DashboardCard({ title, value }: DashboardCardProps) {
    return(
        <Card className="shadow-md rounded-2xl">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}