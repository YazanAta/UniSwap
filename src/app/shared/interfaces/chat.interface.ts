export interface Chat {
  id?: string;
  participants: string[];
  messages?: Message[];
}

export interface Message {
  text: string;
  sender: string;
  timestamp: Date;
}