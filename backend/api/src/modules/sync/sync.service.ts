import { Injectable } from '@nestjs/common';

import { SnapshotPipelineService } from './snapshot-pipeline/snapshot-pipeline.service';
import { SnapshotContext } from './dto/snapshot-context.dto';

@Injectable()
export class SyncService {

    constructor(
        private readonly pipeline: SnapshotPipelineService,
    ) {}

    async getDatabaseSnapshot(
        userId: string,
        language: string,
    ){

        const context = new SnapshotContext(
            userId,
            language
        );

        return await this.pipeline.execute(context);
    }
}
