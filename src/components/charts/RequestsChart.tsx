
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface RequestsChartProps {
  hourlyData: Array<{hour: number, count: number}>;
}

const RequestsChart: React.FC<RequestsChartProps> = ({ hourlyData }) => {
  // Format hour data for display
  const formattedData = hourlyData.map(item => ({
    hour: `${item.hour}:00`,
    count: item.count
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-space-blue p-3 border border-space-accent/30 rounded shadow-md">
          <p className="font-semibold text-space-highlight">{label}</p>
          <p className="font-mono text-space-accent">
            {payload[0].value.toLocaleString()} requests
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="card-gradient border-0 shadow-lg col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-space-highlight">Hourly Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2B63" />
              <XAxis 
                dataKey="hour" 
                tick={{ fill: '#A5B4FC' }}
                tickMargin={10}
                axisLine={{ stroke: '#1A2B63' }}
              />
              <YAxis 
                tick={{ fill: '#A5B4FC' }}
                axisLine={{ stroke: '#1A2B63' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#7B68EE"
                strokeWidth={3}
                dot={{ fill: '#00FFFF', r: 4 }}
                activeDot={{ fill: '#00FFFF', r: 6, stroke: '#7B68EE', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsChart;
