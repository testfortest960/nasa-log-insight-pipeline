
import React, { useState } from "react";
import { SAMPLE_LOG_LINES } from "@/lib/logParser";
import LogUploader from "@/components/LogUploader";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [logData, setLogData] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-space-dark-blue text-white">
      <div className="container mx-auto px-4 py-8">
        {!logData ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="max-w-2xl w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gradient">
                NASA HTTP Log Analysis
              </h1>
              <p className="text-center text-muted-foreground mb-10">
                Upload your NASA HTTP logs to visualize and analyze server traffic patterns.
                <br className="hidden md:block" />
                Compatible with NASA HTTP logs from July 1995.
              </p>
              <LogUploader onLogsLoaded={(logs) => setLogData(logs)} />
            </div>
          </div>
        ) : (
          <Dashboard logData={logData} />
        )}
      </div>

      <footer className="py-6 border-t border-space-blue/30 mt-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>NASA HTTP Log Analysis Dashboard</p>
            <p className="text-xs mt-1">
              Designed for analyzing NASA HTTP logs from July 1995
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
