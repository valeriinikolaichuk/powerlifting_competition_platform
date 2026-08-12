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
  ): Promise<ConnectionsResultDto> {

    if (dto.mode === 'LAN') { return this.checkLan(dto); }

    return this.checkOnline(dto, userId);
  }

  private async checkLan(
    dto: DeviceParametersDto,
  ): Promise<ConnectionsResultDto> {

    /** LAN ADMIN is the source of user_id.*/

    const admin = await this.prisma.deviceStatus.findFirst({
      where: {
        device_role: 'ADMIN',
        mode: 'LAN',
        is_deleted: false,
      },
      select: {
        user_id: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('LAN ADMIN device was not found');
    }

    const userId = admin.user_id;

    /** Check whether this exact device already registered.*/

    const currentDevice = await this.prisma.deviceStatus.findFirst({
      where: {
        user_id: userId,
        device_id: dto.device_id,
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

    /** LAN client does not exist yet.*/

    await this.prisma.deviceStatus.create({
      data: {
        user_id: userId,
        device_id: dto.device_id,
        language: dto.language,
        mode: 'LAN',
        device_role: null,
        is_deleted: false,
      },
    });

    return {
      adminExists: true,
      connections: [],
    };
  }

  private async checkOnline(
    dto: DeviceParametersDto,
    userId?: string,
  ): Promise<ConnectionsResultDto> {

    if (!userId) { throw new UnauthorizedException(); }

    /** Check whether this exact ONLINE device already exists.*/

    const currentDevice = await this.prisma.deviceStatus.findFirst({
        where: {
          user_id: userId,
          device_id: dto.device_id,
          is_deleted: false,
        },
        select: {
          id: true,
          device_role: true,
        },
      });

    /** Device already exists.
     * Do not create another record.*/

    if (currentDevice) {

      const admin = await this.prisma.deviceStatus.findFirst({
        where: {
          user_id: userId,
          device_role: 'ADMIN',
          is_deleted: false,
        },
        select: {
          id: true,
        },
      });

      const connections = await this.findConnections(userId);

      return {
        adminExists: !!admin,
        connections,
      };
    }

    /** Check whether ADMIN exists.*/

    const admin = await this.prisma.deviceStatus.findFirst({
      where: {
        user_id: userId,
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
          user_id: userId,
          device_id: dto.device_id,
          language: dto.language,
          mode: 'ONLINE',
          device_role: 'ADMIN',
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
        user_id: userId,
        device_id: dto.device_id,
        language: dto.language,
        mode: 'ONLINE',
        device_role: null,
        is_deleted: false,
      },
    });

    const connections = await this.findConnections(userId);

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
        user_id: userId,
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
      },
    });

    return records;
  }

  private async findConnections(
    userId: string,
  ): Promise<ConnectionDto[]> {

    return this.prisma.deviceStatus.findMany({
      where: {
        user_id: userId,
        is_deleted: false,
      },
      select: {
        device_id: true,
        language: true,
        device_role: true,
        mode: true,
        ip_address: true,
        user_agent: true,
      },
    });
  }

  async deleteDevice(
    deviceId: string,
    userId?: string,
  ): Promise<void> {

    if (!userId) { throw new UnauthorizedException(); }

    await this.prisma.deviceStatus.deleteMany({
      where: {
        user_id: userId,
        device_id: deviceId,
      },
    });
  }
}