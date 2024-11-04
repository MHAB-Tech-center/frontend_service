/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/base/chart";
import { getAllInspections, getAnalytics } from "@/hooks/useApi";
import { Colors } from "@/lib/constants";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Loader2 } from "lucide-react";
import { Column } from "@/components/ui/table/Table";
import TableWrapper from "@/components/ui/table/TableWrapper";
import { EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const regionChartConfig = {
  reports: {
    label: "Reports",
  },
  kigali: { label: "Kigali", color: "hsl(var(--chart-1))" },
  north: { label: "North", color: "hsl(var(--chart-2))" },
  east: { label: "East", color: "hsl(var(--chart-3))" },
  west: { label: "West", color: "hsl(var(--chart-4))" },
  south: { label: "South", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const inspectorChartConfig = {
  reports: {
    label: "Inspectors",
  },
  senior: { label: "Senior Inspector", color: "hsl(var(--chart-1))" },
  junior: { label: "Junior Inspector", color: "hsl(var(--chart-2))" },
  trainee: { label: "Trainee Inspector", color: "hsl(var(--chart-3))" },
  contract: { label: "Contract Inspector", color: "hsl(var(--chart-4))" },
  intern: { label: "Intern Inspector", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const PieChartComponent = ({
  data,
  config,
  title,
  dataKey,
  nameKey,
}: {
  data: any[];
  config: ChartConfig;
  title: string;
  description: string;
  dataKey: string;
  nameKey: string;
  trend?: number;
  trendText?: string;
  footerText?: string;
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey={dataKey} label nameKey={nameKey} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const DonutChart = ({
  data,
  config,
  title,
  nameKey,
}: {
  data: any[];
  config: ChartConfig;
  title: string;
  description: string;
  nameKey: string;
}) => {
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.reports, 0);
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="reports"
              nameKey={nameKey}
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Reports
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

/* 
 {
    "inspectors": {
      "West": 0,
      "East": 0,
      "South": 0,
      "North": 0,
      "Kigali": 0
    },
    "inspectionReports": {
      "West": 0,
      "East": 0,
      "South": 0,
      "North": 0,
      "Kigali": 3
    }
  }
 */

interface Analytics {
  inspectors: {
    Kigali: number;
    North: number;
    East: number;
    West: number;
    South: number;
  };
  inspectionReports: {
    Kigali: number;
    East: number;
    West: number;
    South: number;
    North: number;
  };
}

// Helper function to convert analytics to chart format
const analyticsToChartData = (
  data: Record<string, number>,
  fillColors: Record<string, string>
) => {
  return Object.entries(data).map(([region, value]) => ({
    region,
    reports: value,
    fill: fillColors[region] || Colors.primary["500"],
  }));
};

const regionFillColors = {
  Kigali: Colors.primary["500"],
  North: Colors.primary["300"],
  East: Colors.primary["400"],
  West: Colors.primary["500"],
  South: Colors.primary["600"],
};

interface Report {
  id: string;
  inspectorName: string;
  region: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const reportsColumns: Column[] = [
  {
    title: "Mine Site",
    key: "minesiteInfo.name",
    sortable: true,
    Element: ({ row }) => <span>{row.minesiteInfo.name}</span>,
  },
  {
    title: "Inspector",
    key: "inspectorInfo",
    sortable: true,
    Element: ({ row }) => (
      <span>{`${row.inspectorInfo.firstName} ${row.inspectorInfo.lastName}`}</span>
    ),
  },
  {
    title: "Inspection Date",
    key: "endDate",
    sortable: true,
    Element: ({ row }) => (
      <span>{new Date(row.endDate).toLocaleDateString()}</span>
    ),
  },
  {
    title: "Status",
    key: "status",
    sortable: true,
    Element: ({ row }) => <span>{row.status}</span>,
  },
  {
    title: "Action",
    key: "action",
    sortable: false,
    Element: ({ row }) => (
      <button
        onClick={() => (window.location.href = `/report/${row.id}`)}
        className="p-2 rounded text-blue-500"
      >
        <EyeIcon className="h-5 w-5" />
      </button>
    ),
  },
];

const ReportsTable = ({
  reports,
  loading,
}: {
  reports: any[];
  loading: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>
          A list of recent inspection reports from all regions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableWrapper
          title="Inspection Reports"
          columns={reportsColumns}
          data={reports}
          filterableByDate
          dateKey="created_at"
          className="min-w-[800px] overflow-x-auto"
          loading={loading}
          onRowClick={(row) => {
            navigate(`/report/${row.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const [analytics, setAnalytics] = React.useState<Analytics | null>(null);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      const [analyticsResponse, reportsResponse] = await Promise.all([
        getAnalytics(),
        getAllInspections(), // You'll need to add this API endpoint
      ]);
      setAnalytics(analyticsResponse.data.data);
      setReports(reportsResponse.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const reportsData = analyticsToChartData(
    analytics.inspectionReports,
    regionFillColors
  );
  const inspectorsData = analyticsToChartData(
    analytics.inspectors,
    regionFillColors
  );

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartComponent
          data={reportsData}
          config={regionChartConfig}
          title="Inspection Reports by Region"
          description="Distribution of Reports"
          dataKey="reports"
          nameKey="region"
        />
        <DonutChart
          data={inspectorsData}
          config={inspectorChartConfig}
          title="Inspectors by Region"
          description="Distribution of Inspectors"
          nameKey="region"
        />
      </div>
      <ReportsTable reports={reports} loading={loading} />
    </div>
  );
};

export default Index;
