import { Command } from 'commander';
import { BaseCommand } from './base-command';
import { exec } from 'child_process';

export class SeedCommand extends BaseCommand {
  public execute(program: Command) {
    program
      .command('seed')
      .description('seed commands')
      .action(async () => {
        exec(
          'docker-compose exec backend-service npm run seed:run',
          (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }

            console.log(`stdout: ${stdout}`);
          },
        );
      });
  }
}
