```typescript
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { $IMPL_CLASS_NAME } from '@backend/$MODULE_NAME/event/impl/$IMPL_FOLDER_NAME';

@EventsHandler($IMPL_CLASS_NAME)
export class $HANDLER_CLASS_NAME implements IEventHandler<$IMPL_CLASS_NAME> {
  async handle(event: $IMPL_CLASS_NAME) {}
}
```
