
import React, { useMemo } from "react";
import { parseLogs, calculateStats } from "@/lib/logParser";
import StatsOverview from "./StatsOverview";
import RequestsChart from "./charts/RequestsChart";
import StatusCodeChart from "./charts/StatusCodeChart";
import LogTable from "./LogTable";
import TopPathsChart from "./charts/TopPathsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface DashboardProps {
  logData: string;
}

const Dashboard: React.FC<DashboardProps> = ({ logData }) => {
  const logs = useMemo(() => parseLogs(logData), [logData]);
  const stats = useMemo(() => calculateStats(logs), [logs]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-gradient">NASA Log Analysis Dashboard</h1>
          <p className="text-muted-foreground">
            Analyzing {stats.totalRequests.toLocaleString()} HTTP requests from July 1995
          </p>
        </div>
      </div>

      <Separator className="bg-space-blue/50 my-4" />

      <StatsOverview stats={stats} />

      <div className="dashboard-grid">
        <RequestsChart hourlyData={stats.requestsPerHour} />
        <StatusCodeChart statusData={stats.statusCodes} />
        <TopPathsChart pathData={stats.topPaths} />
      </div>

      <Tabs defaultValue="logs" className="w-full mt-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-space-blue">
          <TabsTrigger 
            value="logs"
            className="data-[state=active]:bg-space-purple data-[state=active]:text-white"
          >
            Log Entries
          </TabsTrigger>
          <TabsTrigger 
            value="methods"
            className="data-[state=active]:bg-space-purple data-[state=active]:text-white"
          >
            HTTP Methods
          </TabsTrigger>
        </TabsList>
        <TabsContent value="logs">
          <LogTable logs={logs.slice(0, 1000)} /> {/* Limiting to 1000 rows for performance */}
        </TabsContent>
        <TabsContent value="methods">
          <div className="card-gradient rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-space-highlight">HTTP Method Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(stats.requestMethods).map(([method, count]) => (
                <div key={method} className="bg-space-blue/50 rounded-md p-4 text-center">
                  <h4 className="text-lg font-mono font-semibold text-white">{method}</h4>
                  <p className="text-2xl font-bold text-space-accent">{count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    ({((count / stats.totalRequests) * 100).toFixed(1)}% of total)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
