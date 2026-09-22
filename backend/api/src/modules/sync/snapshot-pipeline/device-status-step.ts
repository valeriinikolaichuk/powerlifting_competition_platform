import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { TABLE_DEVICE_STATUS } from '#shared-sql';

@Injectable()
export class DeviceStatusStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService, 
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        for (const table of TABLE_DEVICE_STATUS) {
        
            const result = await this.prisma.$queryRawUnsafe(
                `
                    SELECT 
                        id,
                        created_by_user_id,
                        device_id,
                        mode,
                        language,
                        device_role,
                        ip_address,
                        user_agent,
                        created_at,
                        updated_at,
                        is_deleted
                    FROM "${table}"
                    WHERE created_by_user_id = $1::uuid
                    AND device_id = $2::uuid
                `,
                context.userId,
                context.deviceId,
            );
        
            context.data[table] = result as any[];

            console.log(`Processing table: ${table}`);
        }
    }
}
