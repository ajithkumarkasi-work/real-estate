export type UserRole = "user" | "admin";

export interface VisitRequest {
  id: string;
  propertyId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  visitRequests: VisitRequest[];
}
