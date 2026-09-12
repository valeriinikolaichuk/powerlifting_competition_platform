import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getUserId(sourceId: string): Promise<string> {

        const device = await this.prisma.deviceStatus.findFirst({
            where: {
                device_id: sourceId,
                is_deleted: false,
            },
            select: {
                created_by_user_id: true,
            },
        });

        if (!device) {
            throw new Error(
                `Device not found: ${sourceId}`,
            );
        }

        return device.created_by_user_id;
    }
}
