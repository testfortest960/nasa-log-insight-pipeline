
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogEntry } from "@/types/log";
import { FilterX, Search, ChevronDown } from "lucide-react";

interface LogTableProps {
  logs: LogEntry[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [methodFilter, setMethodFilter] = useState<string | null>(null);

  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return "text-space-green";
    if (status >= 300 && status < 400) return "text-space-yellow";
    if (status >= 400 && status < 500) return "text-space-accent";
    if (status >= 500) return "text-space-red";
    return "text-white";
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || log.status === statusFilter;
    const matchesMethod = methodFilter === null || log.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const uniqueMethods = Array.from(new Set(logs.map(log => log.method)));

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setMethodFilter(null);
  };

  const statusFilterOptions = [
    { value: 200, label: "200 Success" },
    { value: 304, label: "304 Not Modified" },
    { value: 404, label: "404 Not Found" },
    { value: 500, label: "500 Server Error" }
  ];

  return (
    <div className="rounded-md border border-space-blue/50 overflow-hidden">
      <div className="bg-space-blue/40 p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by IP or path..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-space-dark-blue border-space-blue"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-muted-foreground border-space-blue">
                  {statusFilter ? `Status: ${statusFilter}` : "Status Code"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-space-blue border-space-accent">
                {statusFilterOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={statusFilter === option.value ? "bg-space-accent/20 text-space-highlight" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-muted-foreground border-space-blue">
                  {methodFilter || "Method"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-space-blue border-space-accent">
                {uniqueMethods.map(method => (
                  <DropdownMenuItem 
                    key={method}
                    onClick={() => setMethodFilter(method)}
                    className={methodFilter === method ? "bg-space-accent/20 text-space-highlight" : ""}
                  >
                    {method}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {(searchTerm || statusFilter || methodFilter) && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-white"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} log entries
        </div>
      </div>
      
      <div className="max-h-[500px] overflow-auto">
        <Table>
          <TableHeader className="bg-space-purple/50">
            <TableRow>
              <TableHead className="text-space-highlight">IP Address</TableHead>
              <TableHead className="text-space-highlight">Method</TableHead>
              <TableHead className="text-space-highlight">Path</TableHead>
              <TableHead className="text-space-highlight text-right">Status</TableHead>
              <TableHead className="text-space-highlight text-right">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <TableRow 
                  key={index}
                  className="hover:bg-space-blue/20 border-b border-space-blue/20"
                >
                  <TableCell className="font-mono">{log.ip}</TableCell>
                  <TableCell>{log.method}</TableCell>
                  <TableCell className="max-w-[300px] truncate font-mono text-xs">
                    {log.path}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getStatusColor(log.status)}`}>
                    {log.status}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {log.size > 0 ? log.size.toLocaleString() : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No matching log entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LogTable;
