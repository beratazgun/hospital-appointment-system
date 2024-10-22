import { program } from 'commander';
import { CommandInvoker } from './commands/commands-invoker';
import { CreateCommandFile } from './commands/create-command-file';
import { CreateEventFile } from './commands/create-event-file';
import { CreateRepositoryFile } from './commands/create-repository';
import { CreateModelFile } from './commands/create-model';
import { PrismaCommand } from './commands/prisma-command';
import { MongoCommand } from './commands/mongo-command';
import { SeedCommand } from './commands/seed-command';
import { CreateQueryFile } from './commands/create-query-file';

function bootstrap() {
  const invoker = new CommandInvoker();
  invoker.addCommand(new CreateCommandFile());
  invoker.addCommand(new CreateEventFile());
  invoker.addCommand(new CreateRepositoryFile());
  invoker.addCommand(new CreateModelFile());
  invoker.addCommand(new PrismaCommand());
  invoker.addCommand(new MongoCommand());
  invoker.addCommand(new SeedCommand());
  invoker.addCommand(new CreateQueryFile());

  invoker.executeCommands(program);
  program.parse(process.argv);
}

bootstrap();
