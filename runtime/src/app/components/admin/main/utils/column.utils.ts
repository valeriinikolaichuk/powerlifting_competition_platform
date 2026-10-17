import { ColumnPipelineFn } from '../config/config-pipeline.types';

export const langPipeline: ColumnPipelineFn = (column, context) => 
  column.title === 'rankClass' ? context.lang !== 'uk' : null;

export const countryPipeline: ColumnPipelineFn = (column, context) => 
  column.title === 'Country' ? context.competitionLevel !== 'INTERNATIONAL' : null;

export const regionCityPipeline: ColumnPipelineFn = (column, context) => 
  ['Region', 'City'].includes(column.title) 
    ? context.competitionLevel === 'INTERNATIONAL' : null;

export const exercisePipeline: ColumnPipelineFn = (column, context) => 
  ['Squat', 'Deadlift', 'Total'].includes(column.title) 
    ? context.competitionType === 'BENCH_PRESS' : null;

export const COLUMN_PIPELINES: ColumnPipelineFn[] = [
  langPipeline,
  countryPipeline,
  regionCityPipeline,
  exercisePipeline
];
