export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface UserCreate extends User {
  password: string;
}

export interface UserFull extends User {
  reports: Report[];
}

export interface Report {
  id: string;
  userId: string;
  user: User;
  name: string;
  createdAt: String;
  parameters: ParametersResponse[];
}

export interface ReportResponse {
  id: string;
  name: string;
  createdAt: string;
  parameters: ParametersResponse[];
  _count: { parameters: number };
}

export interface ParametersResponse {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalMin?: number | null;
  normalMax?: number | null;
  flagged: boolean;
}

export interface Parameters {
  id: string;
  reportId: string;
  report: Report;
  name: string;
  value: number;
  unit: string;
  normalMin?: number | null;
  normalMax?: number | null;
  flagged: boolean;
}

