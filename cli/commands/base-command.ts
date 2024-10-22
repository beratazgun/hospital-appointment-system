import { TemplateManager } from '@cli/helpers/template-manager';
import { CqrsFilesType } from '@cli/types/cqrs-files.type';
import { Command } from 'commander';
import * as fs from 'fs';
import inquirer from 'inquirer';
import { upperFirst } from 'lodash';
import * as path from 'path';

export abstract class BaseCommand {
  protected existApps = fs.readdirSync(path.join(process.cwd(), '/apps'));

  protected templateManager = new TemplateManager();

  public abstract execute(program: Command): void;

  /**
   * Strip code blocks from the
   */
  protected stripCodeBlocks(template: string): string {
    return template
      .split('\n')
      .filter((line) => line !== '```typescript' && line !== '```')
      .join('\n');
  }

  /**
   * Create Index file for handlers
   */
  protected createIndexFile(
    moduleName: string,
    selectedService: string | undefined,
    cqrsType: CqrsFilesType,
  ) {
    const indexDir = path.join(
      process.cwd(),
      'apps',
      selectedService,
      'src',
      moduleName,
      cqrsType,
      'handler',
      'index.ts',
    );

    if (!fs.existsSync(indexDir)) {
      fs.writeFileSync(indexDir, '');
    }

    const readDir = fs
      .readdirSync(
        path.join(
          process.cwd(),
          'apps',
          selectedService,
          'src',
          moduleName,
          cqrsType,
          'handler',
        ),
      )
      .filter((file) => file !== 'index.ts')
      .map((file) => file.split('.ts')[0]);

    const renderIndexFile = this.templateManager.renderHandlerIndexContent(
      readDir,
      `${upperFirst(moduleName)}${upperFirst(cqrsType)}Handlers`,
    );

    fs.writeFileSync(indexDir, renderIndexFile);
  }

  /**
   * Create command file necessary directories: impl, handler
   */
  protected async createSubDirectories(
    moduleName: string,
    selectedService: string | undefined,
    cqrsType: CqrsFilesType,
  ) {
    const foldersForCqrs = {
      command: ['impl', 'handler'],
      event: ['impl', 'handler'],
      query: ['impl', 'handler'],
    };

    const dir = path.join(
      process.cwd(),
      'apps',
      selectedService,
      'src',
      moduleName,
      cqrsType,
    );

    if (!fs.existsSync(dir)) {
      if (
        cqrsType === 'command' ||
        cqrsType === 'event' ||
        cqrsType === 'query'
      ) {
        foldersForCqrs[cqrsType].forEach((subFolder) => {
          fs.mkdirSync(path.join(dir, subFolder), { recursive: true });
        });
      } else {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Prompt user to select an app
   */
  protected async promptAllApp(): Promise<string> {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Select an app',
        choices: this.existApps,
      },
    ]);

    return answers.choice;
  }
}
