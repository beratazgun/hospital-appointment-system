import { Command } from 'commander';
import { BaseCommand } from './base-command';
import * as fs from 'fs';
import * as path from 'path';

export class CreateCommandFile extends BaseCommand {
  public execute(program: Command) {
    program
      .command('command')
      .argument('<module_name> <file_name>', '.')
      .description('Create a new command file')
      .action(async () => {
        const [command, module, file] = program.args;

        if (module === undefined || file === undefined) {
          console.log('‼️ Please provide module name and file name');
          return;
        }

        if (!this.existApps.length) {
          console.log('No apps found');
          return;
        }

        const selectedApp = await this.promptAllApp();

        await this.createSubDirectories(module, selectedApp, 'command');
        await this.createImplFile(file, module, selectedApp);
        await this.createHandlerFile(file, module, selectedApp);

        this.createIndexFile(module, selectedApp, 'command');
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
      'command',
      'handler',
      `${fileName}.handler.ts`,
    );

    const renderHandlerTemplate =
      this.templateManager.renderCommandHandlerContent(fileName, module);

    if (fs.existsSync(handlerDir)) {
      console.log('‼️ File already exists');
      return;
    }

    fs.writeFileSync(handlerDir, renderHandlerTemplate);
  }

  /**
   * Create the implementation file
   */
  private async createImplFile(
    fileName: string,
    module: string,
    selectedApp: string,
  ) {
    const renderTemplate = this.templateManager.renderImplContent(
      fileName,
      'command',
    );

    const implDir = path.join(
      process.cwd(),
      'apps',
      selectedApp,
      'src',
      module,
      'command',
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
