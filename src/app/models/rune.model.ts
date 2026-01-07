export interface Rune {
  name: string;
  level: number;
  count: number;
  image: string;
}

export interface LogEntry {
  runNumber: number;
  runeName: string;
  count: number;
  timestamp: Date;
}
