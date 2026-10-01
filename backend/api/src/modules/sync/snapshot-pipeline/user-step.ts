import { Injectable } from '@nestjs/common';

import { SnapshotStepInterface } from "./snapshot-pipeline.interface";
import { SnapshotContext } from "../dto/snapshot-context.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UserStep implements SnapshotStepInterface {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async handle(context: SnapshotContext): Promise<void> {

        const result = await this.prisma.$queryRawUnsafe(
            `
            SELECT 
                id,
                role
            FROM users
            WHERE
                id = $1::uuid
                OR role = 'ADMIN'::"UserRole"
            `,
            context.userId,
        );

        context.data['users'] = result as any[];

        console.log('Processing table: users');
    }
}