
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { ChartDataPoint } from "@/types/log";

interface StatusCodeChartProps {
  statusData: Record<string, number>;
}

const StatusCodeChart: React.FC<StatusCodeChartProps> = ({ statusData }) => {
  const getStatusGroupLabel = (code: string): string => {
    const firstDigit = code.charAt(0);
    switch (firstDigit) {
      case '2': return '2xx Success';
      case '3': return '3xx Redirect';
      case '4': return '4xx Client Error';
      case '5': return '5xx Server Error';
      default: return `${code} Other`;
    }
  };

  // Group status codes by first digit
  const groupedData: Record<string, number> = {};
  Object.entries(statusData).forEach(([code, count]) => {
    const group = getStatusGroupLabel(code);
    groupedData[group] = (groupedData[group] || 0) + count;
  });

  const chartData: ChartDataPoint[] = Object.entries(groupedData).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for different status code groups
  const COLORS = {
    '2xx Success': '#C3E88D',      // Green
    '3xx Redirect': '#FFCB6B',     // Yellow
    '4xx Client Error': '#7B68EE',  // Purple
    '5xx Server Error': '#FF5370'   // Red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-space-blue p-3 border border-space-accent/30 rounded shadow-md">
          <p className="font-semibold text-space-highlight">{data.name}</p>
          <p className="font-mono text-space-accent">
            {data.value.toLocaleString()} requests
          </p>
          <p className="text-xs text-muted-foreground">
            {((data.value / Object.values(statusData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="card-gradient border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-space-highlight">Status Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS] || '#A5B4FC'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                layout="horizontal"
                formatter={(value) => <span className="text-white">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCodeChart;
