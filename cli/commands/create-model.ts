import { Command } from 'commander';
import { BaseCommand } from './base-command';
import * as fs from 'fs';
import * as path from 'path';

export class CreateModelFile extends BaseCommand {
  public execute(program: Command) {
    program
      .command('model')
      .argument('<module_name> <file_name>', '.')
      .description('Create a new model file')
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

        await this.createSubDirectories(module, selectedApp, 'model');
        this.createModelFile(file, module, selectedApp);
      });
  }

  protected createModelFile(
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
      'model',
      `${fileName}.model.ts`,
    );

    console.log(fileName, module, selectedApp);

    const renderModelTemplate =
      this.templateManager.renderAggregateModelContent(fileName);

    if (fs.existsSync(handlerDir)) {
      console.log('‼️ File already exists');
      return;
    }

    fs.writeFileSync(handlerDir, renderModelTemplate);
  }
}
