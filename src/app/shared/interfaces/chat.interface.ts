import { Timestamp } from "firebase/firestore";

export interface Chat {
  id?: string;
  participants: string[];
  messages?: Message[];
  unreadCount?: number; 
}

export interface Message {
  id?: string;
  text?: string;
  sender?: string;
  timestamp?: any;
}