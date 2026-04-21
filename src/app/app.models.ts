export type TicketStatus = "nuevo" | "en-proceso" | "resuelto" | "cerrado";
export type TicketPriority = "baja" | "media" | "alta" | "critica";

export interface TicketType {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  comments: TicketComment[];
  activities: TicketActivity[];
}

export interface TicketComment {
  id: string;
  author: string;
  authorRole: string;
  message: string;
  timestamp: string;
}

export interface TicketActivity {
  id: string;
  type: "created" | "status_changed" | "assigned" | "comment";
  author?: string;
  authorRole?: string;
  message?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface User {
  username: string;
  name: string;
  role: "admin" | "tecnico" | "usuario";
  password?: string; // Incluido para el modelo interno
  sessionToken?: string;
  sessionTimestamp?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  ticketId?: string;
  timestamp: string;
  read: boolean;
}