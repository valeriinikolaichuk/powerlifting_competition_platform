import { Injectable, Inject } from '@nestjs/common';

import { SNAPSHOT_PIPELINE } from '../sync.tokens';
import { SnapshotStepInterface } from './snapshot-pipeline.interface';
import { SnapshotContext } from '../dto/snapshot-context.dto';


@Injectable()
export class SnapshotPipelineService {
    
    constructor(
        @Inject(SNAPSHOT_PIPELINE)
            private readonly pipes: SnapshotStepInterface[],
        ) {}

    async execute(
        context: SnapshotContext
    ): Promise<Record<string, any[]>> {

        for (const pipe of this.pipes) {
            await pipe.handle(context);
        }

        return context.data;
    }
}
