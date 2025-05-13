import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, AlertCircle, Server } from "lucide-react";
import { parseLogs } from "@/lib/logParser";
import { toast } from "@/components/ui/use-toast";

interface LogUploaderProps {
  onLogsLoaded: (logs: string) => void;
}

const LogUploader: React.FC<LogUploaderProps> = ({ onLogsLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);
  const [showPipelineSteps, setShowPipelineSteps] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    try {
      const text = await file.text();
      
      // Basic validation - check if it contains log-like entries
      const firstFewLines = text.split('\n').slice(0, 5).join('\n');
      const sampleLogs = parseLogs(firstFewLines);
      
      if (sampleLogs.length === 0) {
        toast({
          title: "Invalid log format",
          description: "The file doesn't appear to be in NASA HTTP log format.",
          variant: "destructive"
        });
        setFileName(null);
        setIsLoading(false);
        return;
      }
      
      onLogsLoaded(text);
      toast({
        title: "Logs loaded successfully",
        description: `Processed ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
      });
    } catch (error) {
      console.error("Error processing log file:", error);
      toast({
        title: "Error processing file",
        description: "Failed to read or process the log file.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSampleData = () => {
    // Import is done inside the component to avoid circular dependencies
    import("@/lib/logParser").then(({ SAMPLE_LOG_LINES }) => {
      onLogsLoaded(SAMPLE_LOG_LINES);
      setFileName("sample-nasa-logs.txt");
      toast({
        title: "Sample logs loaded",
        description: "Using sample NASA HTTP logs for demonstration."
      });
    });
  };

  return (
    <Card className="card-gradient shadow-lg border-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-space-blue/50 backdrop-blur-sm"></div>
      <CardHeader className="relative">
        <CardTitle className="text-gradient flex items-center gap-2">
          <Upload className="h-5 w-5" />
          <span>NASA HTTP Log Analyzer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {!fileName ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-space-highlight bg-space-blue/30"
                : "border-space-accent/30 hover:border-space-accent/60 hover:bg-space-blue/10"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".txt,.log"
              onChange={handleFileInput}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <Upload className="h-12 w-12 text-space-accent/70 mb-2" />
              <div className="space-y-2">
                <p className="text-xl font-semibold">Upload Log File</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop a NASA HTTP log file here or click to browse
                </p>
                <p className="text-xs text-space-accent/70">
                  Accepts .txt or .log files
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-space-blue/20 rounded-lg p-6 animate-fade-in">
            <div className="flex items-center space-x-3">
              <FileText className="h-10 w-10 text-space-accent" />
              <div>
                <p className="font-medium text-space-highlight">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Processing..." : "Ready for analysis"}
                </p>
              </div>
            </div>
            
            {!isLoading && (
              <Button 
                className="w-full mt-4 bg-space-purple hover:bg-space-accent/80 text-white"
                onClick={() => {
                  setFileName(null);
                }}
              >
                Upload a different file
              </Button>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              className="border-space-accent/30 text-space-accent hover:bg-space-blue/30 hover:text-space-highlight"
              onClick={handleUseSampleData}
              disabled={isLoading}
            >
              Use Sample Data
            </Button>

            <div className="text-xs text-muted-foreground flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>NASA HTTP logs (Jul 1995 format)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              variant="link"
              size="sm"
              className="text-space-accent hover:text-space-highlight"
              onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
            >
              {showAdvancedInfo ? "Hide advanced setup" : "Show advanced setup"}
            </Button>
          </div>
          
          {showAdvancedInfo && (
            <div className="mt-2 bg-space-blue/20 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <Server className="h-5 w-5 text-space-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-space-highlight mb-1">Advanced Analysis with Docker/Hadoop</p>
                  <p className="text-muted-foreground text-xs mb-2">
                    For large-scale log analysis, you can use our Docker-based Hadoop ecosystem:
                  </p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                    <li>Docker containers for Hadoop, Flume, Hive, and MapReduce</li>
                    <li>Distributed processing of multi-gigabyte log files</li>
                    <li>Advanced analytics with Hive SQL queries</li>
                    <li>Custom MapReduce jobs for complex aggregations</li>
                  </ul>
                  
                  <div className="mt-3">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-space-accent p-0 h-auto text-xs hover:text-space-highlight"
                      onClick={() => setShowPipelineSteps(!showPipelineSteps)}
                    >
                      {showPipelineSteps ? "Hide pipeline details" : "Show complete pipeline details"}
                    </Button>
                  </div>
                  
                  {showPipelineSteps && (
                    <div className="mt-2 border border-space-accent/20 rounded p-3 bg-space-blue/30">
                      <p className="text-xs font-medium text-space-highlight mb-2">Complete Data Pipeline</p>
                      
                      <ol className="list-decimal list-inside text-xs space-y-2 text-muted-foreground">
                        <li className="pb-2 border-b border-space-accent/10">
                          <span className="font-medium text-space-accent">Collection</span>
                          <p className="mt-1 pl-4">Apache Flume captures logs from web servers and delivers them to HDFS in real-time</p>
                        </li>
                        
                        <li className="pb-2 border-b border-space-accent/10">
                          <span className="font-medium text-space-accent">Storage</span>
                          <p className="mt-1 pl-4">Hadoop Distributed File System (HDFS) provides redundant, scalable storage for petabytes of log data</p>
                        </li>
                        
                        <li className="pb-2 border-b border-space-accent/10">
                          <span className="font-medium text-space-accent">Processing</span>
                          <p className="mt-1 pl-4">MapReduce jobs transform raw logs into structured data, extracting timestamps, status codes, IPs, and request details</p>
                        </li>
                        
                        <li className="pb-2 border-b border-space-accent/10">
                          <span className="font-medium text-space-accent">Analysis</span>
                          <p className="mt-1 pl-4">Apache Hive provides SQL-like querying capabilities for analyzing patterns, identifying anomalies, and generating reports</p>
                        </li>
                        
                        <li>
                          <span className="font-medium text-space-accent">Visualization</span>
                          <p className="mt-1 pl-4">Processed data can be exported to BI tools or integrated with this dashboard for advanced visualization</p>
                        </li>
                      </ol>
                      
                      <p className="text-xs mt-3 text-space-highlight">Recommended for enterprise-level analysis of NASA logs and other HTTP server logs exceeding multiple GB.</p>
                    </div>
                  )}
                  
                  <p className="text-xs mt-2 text-space-accent">
                    See documentation for setup instructions using Docker Compose.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogUploader;
