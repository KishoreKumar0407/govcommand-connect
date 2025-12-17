export type Role = 'ADMIN' | 'CONSTITUENCY';

export interface Location {
  lat: number;
  lng: number; // 0-100 scale for mock map
  x: number;   // CSS percentage for mockup
  y: number;   // CSS percentage for mockup
}

export interface Constituency {
  id: string;
  name: string;
  officerName: string;
  location: Location;
  status: 'ACTIVE' | 'OFFLINE' | 'ALERT';
}

export interface Message {
  id: string;
  toConstituencyId: string; // Target ID
  from: string;
  content: string;
  timestamp: number;
  read: boolean;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface UserSession {
  role: Role;
  constituencyId?: string; // Only if role is CONSTITUENCY
}
