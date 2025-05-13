
export interface LogEntry {
  ip: string;
  timestamp: string;
  request: string;
  method: string;
  path: string;
  status: number;
  size: number;
  hour?: number;
  day?: number;
}

export interface LogStats {
  totalRequests: number;
  uniqueIPs: number;
  totalBytes: number;
  avgResponseSize: number;
  statusCodes: Record<string, number>;
  topPaths: Array<{path: string, count: number}>;
  requestsPerHour: Array<{hour: number, count: number}>;
  requestsPerDay: Array<{day: number, count: number}>;
  requestMethods: Record<string, number>;
}

export type ChartDataPoint = {
  name: string;
  value: number;
}
