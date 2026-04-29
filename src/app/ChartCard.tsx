import { Card, AreaChart, Title, Text } from "@tremor/react";

export interface YearlyData {
  year: number;
  balance: number;
}

export interface SimulationData {
  analysis: string;
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  expectedReturnRate: number;
  yearlyBreakdown: YearlyData[];
}

export const ChartCard = ({ data }: { data: SimulationData }) => (
  <Card className="bg-slate-900 border-slate-800">
    <Title className="text-emerald-400">Proyeksi Kekayaan Aura</Title>
    <Text className="text-slate-400">
      Estimasi pertumbuhan aset Anda dalam {data.years} tahun
    </Text>
    <AreaChart
      className="h-72 mt-4"
      data={data.yearlyBreakdown}
      index="year"
      categories={["balance"]}
      colors={["emerald"]}
      valueFormatter={(number) =>
        `Rp ${Intl.NumberFormat("id").format(number)}`
      }
      showLegend={false}
    />
  </Card>
);
