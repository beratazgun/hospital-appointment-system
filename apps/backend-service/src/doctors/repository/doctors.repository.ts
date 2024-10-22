import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { FilterDto } from '@backend/core/dtos/Filter.dto';
import { Paginator } from '@backend/core/helpers/paginator';
import { DoctorsSearchQueryDto } from '../dtos';

@Injectable()
export class DoctorsRepository {
  constructor(
    private readonly paginator: Paginator,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Get all doctors
   */
  async getAllDoctors(query: FilterDto) {
    return await this.paginator.paginate(
      'Doctor',
      'findMany',
      {
        orderBy: {
          firstName: 'asc',
        },
        include: {
          Polyclinic: true,
          Hospital: true,
        },
      },
      query,
    );
  }

  /**
   * Search Doctor
   */
  async searchDoctor(search: string) {
    return this.prismaService.doctor.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        firstName: 'asc',
      },
      select: {
        doctorCode: true,
        fullName: true,
        firstName: true,
        lastName: true,
      },
      take: 10,
    });
  }
}
