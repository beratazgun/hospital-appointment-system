import { Command } from 'commander';
import { BaseCommand } from './base-command';
import * as fs from 'fs';
import * as path from 'path';

export class CreateQueryFile extends BaseCommand {
  async execute(program: Command) {
    program
      .command('query')
      .argument('<module_name> <file_name>', 'Create a new query file')
      .description('Create a new query file')
      .action(async () => {
        const [command, module, file] = program.args;

        if (module === undefined || file === undefined) {
          console.log('‼️ Please provide module name and file name');
          return;
        }

        const selectedApp = await this.promptAllApp();

        await this.createSubDirectories(module, selectedApp, 'query');
        await this.createImplFile(file, module, selectedApp);
        await this.createHandlerFile(file, module, selectedApp);

        this.createIndexFile(module, selectedApp, 'query');
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
      'query',
      'handler',
      `${fileName}.handler.ts`,
    );

    const renderHandlerTemplate =
      this.templateManager.renderQueryHandlerContent(fileName, module);

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
      'query',
    );

    const implDir = path.join(
      process.cwd(),
      'apps',
      selectedApp,
      'src',
      module,
      'query',
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
