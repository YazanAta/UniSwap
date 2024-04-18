export interface Chat {
  id?: string;
  participants?: string[];
  messages?: Message[];
}

export interface Message {
  id?: string;
  text?: string;
  sender?: string;
  timestamp?: any;
}