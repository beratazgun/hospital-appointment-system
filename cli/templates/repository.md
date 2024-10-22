```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';

@Injectable()
export class $REPOSITORY_NAME {
  constructor(private readonly prismaService: PrismaService) {}
}
```
