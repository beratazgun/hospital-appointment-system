```typescript
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { $IMPL_CLASS_NAME } from '@backend/$MODULE_NAME/command/impl/$IMPL_FOLDER_NAME';

@CommandHandler($IMPL_CLASS_NAME)
export class $HANDLER_CLASS_NAME implements ICommandHandler<$IMPL_CLASS_NAME> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: $IMPL_CLASS_NAME) {}
}
```
