import { ConnectionDto } from "./connection-dto";

export interface ConnectionsResultDto {
  adminExists: boolean;
  connections: ConnectionDto[];
}
