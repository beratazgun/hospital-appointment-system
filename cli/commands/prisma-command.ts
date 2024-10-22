import { Command } from 'commander';
import { BaseCommand } from './base-command';
import { exec } from 'child_process';

const prismaCommands = {
  generate: 'npx prisma generate',
  migrate: 'npx prisma migrate dev --name first_migration',
  updateDB: 'npx prisma db push --accept-data-loss',
} as const;

type commandType = keyof typeof prismaCommands;

export class PrismaCommand extends BaseCommand {
  public execute(program: Command) {
    program
      .command('prisma')
      .argument('<command_name>', '.')
      .description('prisma commands')
      .action(async () => {
        const [command, module, file] = program.args;

        if (!Object.keys(prismaCommands).includes(module as commandType)) {
          console.log(
            'Invalid command. Please use one of the following commands:' +
              Object.keys(prismaCommands).join(', '),
          );
          return;
        }

        this.runCommand(module as commandType);
      });
  }

  runCommand(command: commandType) {
    exec(
      `docker-compose exec backend-service ${prismaCommands[command]}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }

        console.log(`stdout: ${stdout}`);
      },
    );
  }
}
