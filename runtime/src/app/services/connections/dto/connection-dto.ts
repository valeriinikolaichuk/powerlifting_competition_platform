export interface ConnectionDto {
  id: string;
  created_by_user_id: string;
  device_id: string;
  language: string;
  device_role: string | null;
  mode: string;
  ip_address?: string;
  user_agent?: string;
  browser?: string;
  created_at: Date;
  created_at_formatted?: string;
  updated_at: Date;
  sent_at?: Date | null;
  is_deleted: boolean;
}