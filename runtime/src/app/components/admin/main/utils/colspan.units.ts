import { ColumnContext } from "../config/column-context";
import { ConfigPipelineFn } from "../config/config-pipeline.types";
import { HiddenColspanDto } from "../config/colspan.dto";

export type ColspanPipelineFn = ConfigPipelineFn<ColumnContext, HiddenColspanDto>;

export const ageGroupsPipeline: ColspanPipelineFn = context =>
  context.ageGroupsCount === 1
    ? {
        competitionColspan: 1,
        infoColspan: 1,
      }
    : null;

export const rankClassPipeline: ColspanPipelineFn = context =>
  context.lang !== 'uk'
    ? {
        competitionColspan: 1,
        infoColspan: 1,
      }
    : null;

export const countryPipeline: ColspanPipelineFn = context =>
  context.competitionLevel !== 'INTERNATIONAL'
    ? {
        competitionColspan: 1,
        referenceColspan: 1,
      }
    : null;

export const regionCityPipeline: ColspanPipelineFn = context =>
  context.competitionLevel === 'INTERNATIONAL'
    ? {
        competitionColspan: 2,
        referenceColspan: 2,
      }
    : null;

export const disciplinesPipeline: ColspanPipelineFn = context =>
  context.competitionType === 'BENCH_PRESS'
    ? {
        competitionColspan: 3,
        diciplineColspan: 3,
      }
    : null;

export const COLSPAN_PIPELINES: ColspanPipelineFn[] = [
  ageGroupsPipeline,
  rankClassPipeline,
  countryPipeline,
  regionCityPipeline,
  disciplinesPipeline,
];