import { Command } from 'commander';
import { BaseCommand } from './base-command';
import * as fs from 'fs';
import * as path from 'path';

export class CreateRepositoryFile extends BaseCommand {
  public execute(program: Command) {
    program
      .command('repository')
      .argument('<module_name> <file_name>', '.')
      .description('Create a new repository file')
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

        await this.createSubDirectories(module, selectedApp, 'repository');
        this.createRepositoryFile(file, module, selectedApp);
      });
  }

  protected createRepositoryFile(
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
      'repository',
      `${fileName}.repository.ts`,
    );

    console.log(fileName, module, selectedApp);

    const renderRepositoryTemplate =
      this.templateManager.renderRepositoryContent(fileName);

    if (fs.existsSync(handlerDir)) {
      console.log('‼️ File already exists');
      return;
    }

    fs.writeFileSync(handlerDir, renderRepositoryTemplate);
  }
}
