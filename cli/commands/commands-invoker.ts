import { Command } from 'commander';
import { BaseCommand } from './base-command';

export class CommandInvoker {
  private commands: BaseCommand[] = [];

  addCommand(command: BaseCommand) {
    this.commands.push(command);
  }

  executeCommands(program: Command) {
    this.commands.forEach((command) => command.execute(program));
  }
}
