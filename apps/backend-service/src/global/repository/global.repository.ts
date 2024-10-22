import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class GlobalRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   *
   */
  async getNotificationTemplateByCodeAndType(
    code: string,
    type: NotificationType,
  ) {
    return this.prismaService.notificationTemplate.findFirstOrThrow({
      where: {
        code,
        type,
      },
    });
  }
}
