export interface ConnectionDto {
  device_id: string;
  language: string;
  device_role: string | null;
  mode: string;

  ip_address: string | null;
  user_agent: string | null;
}