
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface TopPathsChartProps {
  pathData: Array<{path: string, count: number}>;
}

const TopPathsChart: React.FC<TopPathsChartProps> = ({ pathData }) => {
  // Format and limit data
  const formattedData = pathData.slice(0, 5).map(item => {
    // Truncate long paths for better display
    const displayPath = item.path.length > 20 
      ? item.path.substring(0, 17) + "..." 
      : item.path;
      
    return {
      path: displayPath,
      fullPath: item.path,
      count: item.count
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullPath = payload[0].payload.fullPath;
      return (
        <div className="bg-space-blue p-3 border border-space-accent/30 rounded shadow-md">
          <p className="text-xs font-mono text-space-highlight mb-1 max-w-[250px] break-words">
            {fullPath}
          </p>
          <p className="font-semibold text-space-accent">
            {payload[0].value.toLocaleString()} requests
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="card-gradient border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-space-highlight">Top Requested Paths</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2B63" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fill: '#A5B4FC' }}
                axisLine={{ stroke: '#1A2B63' }}
              />
              <YAxis 
                type="category"
                dataKey="path" 
                tick={{ fill: '#A5B4FC' }}
                axisLine={{ stroke: '#1A2B63' }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#7B68EE" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPathsChart;
