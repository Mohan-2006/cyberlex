export enum Sender {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface CaseDetails {
  incidentDate: string;
  incidentType: string; // e.g., Data Breach, Ransomware, Copyright, Phishing
  jurisdiction: string;
  affectedParties: string;
  description: string;
}

export enum AppMode {
  CHAT = 'CHAT',
  ADVISOR = 'ADVISOR',
  RESOURCES = 'RESOURCES'
}

export interface ComplianceStandard {
  id: string;
  name: string;
  code: string;
  description: string;
}