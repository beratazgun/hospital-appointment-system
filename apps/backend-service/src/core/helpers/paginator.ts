import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { GetResult, Operation } from '@prisma/client/runtime/library';
import { PrismaService } from '@common';
import { lowerFirst } from 'lodash';
import { EnvType } from '@Root/config/env.validation';
import { FilterDto } from '../dtos/Filter.dto';

type PaginationResult<T> = {
  pagination: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
  };
  docs: T;
};

type PrismaSchemas = keyof typeof Prisma.ModelName;
type PrismaSchemaOperations = Extract<Operation, 'findMany' | 'groupBy'>;

@Injectable()
export class Paginator {
  constructor(
    private configService: ConfigService<EnvType>,
    private prismaService: PrismaService,
  ) {}

  async paginate<
    TSchema extends PrismaSchemas,
    TOperation extends PrismaSchemaOperations,
    TArgs extends
      Prisma.TypeMap['model'][TSchema]['operations'][TOperation]['args'],
  >(
    schema: TSchema,
    operation: TOperation,
    args: TArgs,
    { page, limit }: FilterDto,
  ): Promise<
    PaginationResult<
      GetResult<Prisma.TypeMap['model'][TSchema]['payload'], TArgs, TOperation>
    >
  > {
    const skip = (page - 1) * limit;

    const argsQuery = { ...args, skip, take: limit };

    const model = this.prismaService[lowerFirst(schema)];

    const [docs, totalDocs] = await Promise.all([
      model[operation](argsQuery),
      model.count({ where: args.where }),
    ]);

    const pagination = this.buildPagination(page, limit, totalDocs, schema);

    return { pagination, docs };
  }

  private buildPagination(
    page: number,
    limit: number,
    totalDocs: number,
    schema: PrismaSchemas,
  ) {
    const totalPages = Math.ceil(totalDocs / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const baseUrl = this.configService.get<string>('APIGW_SERVICE_DOMAIN');
    const buildUrl = (p: number) =>
      `${baseUrl}/${schema.toLowerCase()}/all?page=${p}&limit=${limit}`;

    return {
      page,
      limit,
      totalDocs,
      totalPages,
      nextPage,
      prevPage,
      nextPageUrl: nextPage ? buildUrl(nextPage) : null,
      prevPageUrl: prevPage ? buildUrl(prevPage) : null,
    };
  }
}
