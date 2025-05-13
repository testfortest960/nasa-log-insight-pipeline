
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatBytes } from "@/lib/logParser";
import { LogStats } from "@/types/log";
import { Users, Globe, FileText, HardDrive, CircleAlert } from "lucide-react";

interface StatsOverviewProps {
  stats: LogStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  // Calculate error rate
  const errorCount = Object.entries(stats.statusCodes)
    .filter(([code]) => code.startsWith("4") || code.startsWith("5"))
    .reduce((sum, [, count]) => sum + count, 0);
  
  const errorRate = stats.totalRequests > 0 
    ? ((errorCount / stats.totalRequests) * 100).toFixed(2)
    : "0.00";

  const statCards = [
    {
      title: "Total Requests",
      value: stats.totalRequests.toLocaleString(),
      icon: <FileText className="h-4 w-4" />,
      color: "text-space-highlight",
    },
    {
      title: "Unique IPs",
      value: stats.uniqueIPs.toLocaleString(),
      icon: <Globe className="h-4 w-4" />,
      color: "text-space-accent",
    },
    {
      title: "Total Data",
      value: formatBytes(stats.totalBytes),
      icon: <HardDrive className="h-4 w-4" />,
      color: "text-space-green",
    },
    {
      title: "Avg Response Size",
      value: formatBytes(stats.avgResponseSize),
      icon: <FileText className="h-4 w-4" />,
      color: "text-space-yellow",
    },
    {
      title: "Error Rate",
      value: `${errorRate}%`,
      icon: <CircleAlert className="h-4 w-4" />,
      color: "text-space-red",
    },
  ];

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 pb-2 pt-1">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="min-w-[180px] border-0 bg-space-blue/40 backdrop-blur-sm shadow-md"
          >
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className={`rounded-full p-2 ${stat.color} bg-space-dark-blue/50`}>
                {stat.icon}
              </div>
              <h3 className="mt-3 font-semibold text-sm text-muted-foreground">{stat.title}</h3>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default StatsOverview;
