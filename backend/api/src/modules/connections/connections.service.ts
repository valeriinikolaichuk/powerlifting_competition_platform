import {Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { DeviceParametersDto } from './dto/device-parameters-dto';
import { ConnectionsResultDto } from './dto/connections-result-dto';
import { ConnectionDto } from './dto/connection-dto';

@Injectable()
export class ConnectionsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async checkAdmin(
    dto: DeviceParametersDto,
    userId?: string,
    ipAddress?: string | null,
  ): Promise<ConnectionsResultDto> {

    if (dto.mode === 'LAN') { 
      return this.checkLan(
        dto, 
        userId,
        ipAddress
      ); 
    }

    return this.checkOnline(
      dto, 
      userId, 
      ipAddress
    );
  }

  private async checkLan(
    dto: DeviceParametersDto,
    userId?: string,
    ipAddress?: string | null,
  ): Promise<ConnectionsResultDto> {

    /** Check whether this exact device already registered.*/

    if (!userId) { throw new UnauthorizedException(); }

    const currentDevice = await this.prisma.deviceStatus.findFirst({
      where: {
        created_by_user_id: userId,
        device_id: dto.device_id,
        device_role: 'ADMIN',
        is_deleted: false,
      },
    });

    /** LAN ADMIN itself.*/

    if (currentDevice) {

      const connections = await this.findConnectionsWithoutAdmin(userId);

      return {
        adminExists: false,
        connections,
      };
    }

    /** Check whether this exact LAN Client device already exists.*/

    const currentClient = await this.prisma.deviceStatus.findFirst({
        where: {
          created_by_user_id: userId,
          device_id: dto.device_id,
          is_deleted: false,
        },
        select: {
          id: true,
        },
      });

    /** Device already exists.
     * Do not create another record.*/

    if (!currentClient) {

    /** LAN client does not exist yet.*/

      await this.prisma.deviceStatus.create({
        data: {
          created_by_user_id: userId,
          device_id: dto.device_id,
          language: dto.language,
          mode: 'LAN',
          device_role: null,
          ip_address: ipAddress,
          user_agent: dto.user_agent,
          is_deleted: false,
        },
      });
    }

    return {
      adminExists: true,
      connections: [],
    };
  }

  private async checkOnline(
    dto: DeviceParametersDto,
    userId?: string,
    ipAddress?: string | null,
  ): Promise<ConnectionsResultDto> {

    if (!userId) { throw new UnauthorizedException(); }

    /** Check whether this exact ONLINE device already exists.*/

    const currentDevice = await this.prisma.deviceStatus.findFirst({
        where: {
          created_by_user_id: userId,
          device_id: dto.device_id,
          is_deleted: false,
        },
        select: {
          id: true,
        },
      });

    /** Device already exists.
     * Do not create another record.*/

    if (currentDevice) {

      const admin = await this.prisma.deviceStatus.findFirst({
        where: {
          created_by_user_id: userId,
          device_role: 'ADMIN',
          is_deleted: false,
        },
        select: {
          id: true,
        },
      });

      const connections = await this.findConnectionsWithoutCurrentDevice(
        userId,
        dto.device_id
      );

      return {
        adminExists: !!admin,
        connections,
      };
    }

    /** Check whether ADMIN exists.*/

    const admin = await this.prisma.deviceStatus.findFirst({
      where: {
        created_by_user_id: userId,
        device_role: 'ADMIN',
        is_deleted: false,
      },
      select: {
        id: true,
      },
    });

    /** No ADMIN exists.
     * Current device becomes ADMIN.*/

    if (!admin) {

      await this.prisma.deviceStatus.create({
        data: {
          created_by_user_id: userId,
          device_id: dto.device_id,
          language: dto.language,
          mode: 'ONLINE',
          device_role: 'ADMIN',
          ip_address: ipAddress,
          user_agent: dto.user_agent,
          is_deleted: false,
        },
      });

      const connections = await this.findConnectionsWithoutAdmin(userId);

      return {
        adminExists: false,
        connections,
      };
    }

    /** ADMIN already exists.
     * Register current ONLINE device without role.*/

    await this.prisma.deviceStatus.create({
      data: {
        created_by_user_id: userId,
        device_id: dto.device_id,
        language: dto.language,
        mode: 'ONLINE',
        device_role: null,
        ip_address: ipAddress,
        user_agent: dto.user_agent,
        is_deleted: false,
      },
    });

    const connections = await this.findConnectionsWithoutCurrentDevice(
      userId,
      dto.device_id
    );

    return {
      adminExists: true,
      connections,
    };
  }

  private async findConnectionsWithoutAdmin(
    userId: string,
  ): Promise<ConnectionDto[]> {

    const records = await this.prisma.deviceStatus.findMany({
      where: {
        created_by_user_id: userId,
        device_role: {
          not: 'ADMIN',
        },
        is_deleted: false,
      },
      select: {
        device_id: true,
        language: true,
        device_role: true,
        mode: true,
        ip_address: true,
        user_agent: true,
        created_at: true,
      },
    });

    return records;
  }

  private async findConnectionsWithoutCurrentDevice(
    userId: string,
    current_device_id: string
  ): Promise<ConnectionDto[]> {

    return this.prisma.deviceStatus.findMany({
      where: {
        created_by_user_id: userId,
        device_id: {
          not: current_device_id,
        },
        is_deleted: false,
      },
      select: {
        device_id: true,
        language: true,
        device_role: true,
        mode: true,
        ip_address: true,
        user_agent: true,
        created_at: true,
      },
    });
  }

  async deleteDevices(
    deviceIds: string[],
  ): Promise<void> {

    await this.prisma.deviceStatus.deleteMany({
      where: {
        device_id: {
          in: deviceIds,
        },
      },
    });
  }
}