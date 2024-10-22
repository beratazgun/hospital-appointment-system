import { Command } from 'commander';
import { BaseCommand } from './base-command';
import * as fs from 'fs';
import * as path from 'path';

export class CreateEventFile extends BaseCommand {
  async execute(program: Command) {
    program
      .command('event')
      .argument('<module_name> <file_name>', 'Create a new command file')
      .description('Create a new event file')
      .action(async () => {
        const [command, module, file] = program.args;

        if (module === undefined || file === undefined) {
          console.log('‼️ Please provide module name and file name');
          return;
        }

        const selectedApp = await this.promptAllApp();

        this.createSubDirectories(module, selectedApp, 'event');
        await this.createImplFile(file, module, selectedApp);
        await this.createHandlerFile(file, module, selectedApp);

        this.createIndexFile(module, selectedApp, 'event');
      });
  }

  /**
   * Create the Handler file
   */
  private async createHandlerFile(
    fileName: string,
    module: string,
    selectedApp: string,
  ) {
    const handlerDir = path.join(
      process.cwd(),
      'apps',
      selectedApp,
      'src',
      module,
      'event',
      'handler',
      `${fileName}.handler.ts`,
    );

    const renderHandlerTemplate =
      this.templateManager.renderEventHandlerContent(fileName, module);

    if (fs.existsSync(handlerDir)) {
      console.log('‼️ File already exists');
      return;
    }

    fs.writeFileSync(handlerDir, renderHandlerTemplate);
  }

  private async createImplFile(
    fileName: string,
    module: string,
    selectedApp: string,
  ) {
    const renderTemplate = this.templateManager.renderImplContent(
      fileName,
      'event',
    );

    const implDir = path.join(
      process.cwd(),
      'apps',
      selectedApp,
      'src',
      module,
      'event',
      'impl',
      `${fileName}.impl.ts`,
    );

    if (fs.existsSync(implDir)) {
      console.log('‼️ File already exists');
      return;
    }

    fs.writeFileSync(implDir, renderTemplate);
  }
}
