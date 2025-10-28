export interface ActivityLog {
    _id: string;
    userId: number;
    username: string;
    action: string;
    description: string;
    ip: string;
    userAgent: string;
    date: string; // ISO date string
    __v: number;
  }
  