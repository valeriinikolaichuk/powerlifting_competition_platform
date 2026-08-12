export interface ConnectionDto {
  device_id: string;
  language: string;
  device_role: string | null;
  mode: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}