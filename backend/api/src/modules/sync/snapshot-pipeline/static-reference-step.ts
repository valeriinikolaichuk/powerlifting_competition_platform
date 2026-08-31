import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { STATIC_REFERENCE_TABLES } from '#shared-sql';

@Injectable()
export class StaticReferenceStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of STATIC_REFERENCE_TABLES) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `SELECT * FROM ${table}`
            );
        
            context.data[table] = result as any[];

            console.log(`Processing table: ${table}`);
        }
    }
}
