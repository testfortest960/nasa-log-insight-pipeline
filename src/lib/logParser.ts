
import { LogEntry, LogStats } from "@/types/log";

// Parse a line of NASA log format
export function parseLogLine(line: string): LogEntry | null {
  // NASA log format regex pattern
  const pattern = /^(\S+) - - \[([\w:/]+\s[+\-]\d{4})\] "([A-Z]+) (.+?) HTTP\/\d\.\d" (\d{3}) (\d+|-)/;
  const match = line.match(pattern);
  
  if (!match) return null;
  
  const [, ip, timestamp, method, path, status, sizeStr] = match;
  
  // Parse size (might be "-" for no content)
  const size = sizeStr === '-' ? 0 : parseInt(sizeStr, 10);
  
  // Convert timestamp to parts for filtering
  const date = parseTimestamp(timestamp);
  
  return {
    ip,
    timestamp,
    request: `${method} ${path} HTTP/1.0`,
    method,
    path,
    status: parseInt(status, 10),
    size,
    hour: date ? date.getHours() : undefined,
    day: date ? date.getDate() : undefined
  };
}

// Parse the NASA log format timestamp
function parseTimestamp(timestamp: string): Date | null {
  // Format: DD/MMM/YYYY:HH:MM:SS +ZZZZ
  const pattern = /(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})/;
  const match = timestamp.match(pattern);
  
  if (!match) return null;
  
  const [, day, monthStr, year, hour, minute, second] = match;
  
  // Convert month name to month index (0-11)
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, 
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  
  const month = months[monthStr];
  
  return new Date(
    parseInt(year, 10),
    month,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10),
    parseInt(second, 10)
  );
}

// Parse multiple lines of logs
export function parseLogs(logText: string): LogEntry[] {
  return logText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(parseLogLine)
    .filter((entry): entry is LogEntry => entry !== null);
}

// Calculate statistics from log entries
export function calculateStats(logs: LogEntry[]): LogStats {
  // Count unique IPs
  const uniqueIPs = new Set(logs.map(log => log.ip)).size;
  
  // Total bytes transferred
  const totalBytes = logs.reduce((sum, log) => sum + log.size, 0);
  
  // Status code distribution
  const statusCodes: Record<string, number> = {};
  logs.forEach(log => {
    const statusCode = log.status.toString();
    statusCodes[statusCode] = (statusCodes[statusCode] || 0) + 1;
  });
  
  // Top paths
  const pathCounts: Record<string, number> = {};
  logs.forEach(log => {
    pathCounts[log.path] = (pathCounts[log.path] || 0) + 1;
  });
  
  const topPaths = Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Requests per hour
  const requestsByHour: Record<number, number> = {};
  logs.forEach(log => {
    if (log.hour !== undefined) {
      requestsByHour[log.hour] = (requestsByHour[log.hour] || 0) + 1;
    }
  });
  
  const requestsPerHour = Array.from(
    { length: 24 },
    (_, hour) => ({ hour, count: requestsByHour[hour] || 0 })
  );
  
  // Requests per day
  const requestsByDay: Record<number, number> = {};
  logs.forEach(log => {
    if (log.day !== undefined) {
      requestsByDay[log.day] = (requestsByDay[log.day] || 0) + 1;
    }
  });
  
  const requestsPerDay = Object.entries(requestsByDay)
    .map(([day, count]) => ({ day: parseInt(day), count }))
    .sort((a, b) => a.day - b.day);
  
  // Method distribution
  const requestMethods: Record<string, number> = {};
  logs.forEach(log => {
    requestMethods[log.method] = (requestMethods[log.method] || 0) + 1;
  });
  
  return {
    totalRequests: logs.length,
    uniqueIPs,
    totalBytes,
    avgResponseSize: totalBytes / logs.length,
    statusCodes,
    topPaths,
    requestsPerHour,
    requestsPerDay,
    requestMethods
  };
}

// Format bytes to human-readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Sample or demo log data
export const SAMPLE_LOG_LINES = [
  `199.72.81.55 - - [01/Jul/1995:00:00:01 -0400] "GET /history/apollo/ HTTP/1.0" 200 6245`,
  `unicomp6.unicomp.net - - [01/Jul/1995:00:00:06 -0400] "GET /shuttle/countdown/ HTTP/1.0" 200 3985`,
  `199.120.110.21 - - [01/Jul/1995:00:00:09 -0400] "GET /shuttle/missions/sts-73/mission-sts-73.html HTTP/1.0" 200 4085`,
  `burger.letters.com - - [01/Jul/1995:00:00:11 -0400] "GET /shuttle/countdown/liftoff.html HTTP/1.0" 304 0`,
  `199.120.110.21 - - [01/Jul/1995:00:00:11 -0400] "GET /shuttle/missions/sts-73/sts-73-patch-small.gif HTTP/1.0" 200 4179`,
  `burger.letters.com - - [01/Jul/1995:00:00:12 -0400] "GET /images/NASA-logosmall.gif HTTP/1.0" 304 0`,
  `burger.letters.com - - [01/Jul/1995:00:00:12 -0400] "GET /shuttle/countdown/video/livevideo.gif HTTP/1.0" 200 0`,
  `205.212.115.106 - - [01/Jul/1995:00:00:12 -0400] "GET /shuttle/countdown/countdown.html HTTP/1.0" 200 3985`,
  `d104.aa.net - - [01/Jul/1995:00:00:13 -0400] "GET /shuttle/countdown/ HTTP/1.0" 200 3985`,
  `129.94.144.152 - - [01/Jul/1995:00:00:13 -0400] "GET / HTTP/1.0" 200 7074`,
  `unicomp6.unicomp.net - - [01/Jul/1995:00:00:14 -0400] "GET /shuttle/countdown/count.gif HTTP/1.0" 200 40310`,
  `199.120.110.21 - - [01/Jul/1995:00:00:15 -0400] "GET /shuttle/missions/sts-73/sts-73-patch-large.gif HTTP/1.0" 200 98084`,
  `pipe3.nyc.pipeline.com - - [01/Jul/1995:00:00:17 -0400] "GET /shuttle/missions/sts-71/images/KSC-95EC-0423.jpg HTTP/1.0" 200 46273`,
  `205.212.115.106 - - [01/Jul/1995:00:00:17 -0400] "GET /shuttle/countdown/countclock.gif HTTP/1.0" 200 13769`,
  `d104.aa.net - - [01/Jul/1995:00:00:18 -0400] "GET /shuttle/countdown/clock_lite.gif HTTP/1.0" 200 733`,
  `129.94.144.152 - - [01/Jul/1995:00:00:18 -0400] "GET /images/ksclogo-medium.gif HTTP/1.0" 200 5866`,
  `unicomp6.unicomp.net - - [01/Jul/1995:00:00:14 -0400] "GET /shuttle/countdown/countdown.html HTTP/1.0" 404 0`,
  `199.120.110.21 - - [01/Jul/1995:00:00:15 -0400] "GET /shuttle/missions/missions.html HTTP/1.0" 500 1839`,
  `130.110.74.81 - - [01/Jul/1995:00:00:13 -0400] "HEAD /shuttle/missions/sts-71/mission-sts-71.html HTTP/1.0" 200 0`
].join('\n');
