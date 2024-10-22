import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpResponse } from '@common/helpers/http-response';
import { omit } from 'lodash';
import { GetUserQuery } from '@backend/user/query/impl/get-user.impl';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor() {}

  async execute(query: GetUserQuery) {
    const { req } = query;

    return new HttpResponse(200, {
      user: omit(req.session.user, ['password', 'id']),
    });
  }
}
