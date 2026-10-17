import { Injectable } from '@angular/core';

import { ConfigPipelineFn } from '../config/config-pipeline.types';

@Injectable({
  providedIn: 'root',
})
export class ColspanFactoryService {
  
  create<
    TContext,
    TConfig extends Record<string, any>,
    THidden extends Record<keyof THidden, number>,
  >(
    context: TContext,
    config: TConfig,
    pipelines: ConfigPipelineFn<TContext, THidden>[],
  ): TConfig {

    const deductions: Record<string, number> = {};

    for (const key of Object.keys(config)) {
      deductions[key] = 0;
    }

    for (const pipeline of pipelines) {
      const result = pipeline(context);

      if (!result) {
        continue;
      }

      for (const [key, value] of Object.entries(result)) {
        if (key in deductions && typeof value === 'number') {
          deductions[key] += value;
        }
      }
    }

    return Object.fromEntries(
      Object.entries(config).map(([key, value]) => [
        key,
        value - deductions[key],
      ]),
    ) as TConfig;
  }
}
