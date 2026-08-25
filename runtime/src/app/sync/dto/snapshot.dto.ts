export interface SnapshotDto {
    
  data: {
    [tableName: string]: Record<string, any>[];
  };
}