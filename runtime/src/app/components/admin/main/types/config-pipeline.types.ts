import { AthleteTableColumn } from "../models/athlete-table-column.interface";
import { ColumnContext } from "../config/column-context";

export type ColumnPipelineFn = (
  column: AthleteTableColumn, context: ColumnContext
) => boolean | null;

export type ConfigPipelineFn<TContext, TResult extends Record<keyof TResult, number>> = (
  context: TContext,
) => Partial<TResult> | null;