```typescript
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { $IMPL_CLASS_NAME } from '@backend/$MODULE_NAME/query/impl/$IMPL_FOLDER_NAME';

@QueryHandler($IMPL_CLASS_NAME)
export class $HANDLER_CLASS_NAME implements IQueryHandler<$IMPL_CLASS_NAME> {
  async execute(event: $IMPL_CLASS_NAME) {}
}
```
