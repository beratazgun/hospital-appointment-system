import path from 'path';
import { camelCase, upperCase, upperFirst } from 'lodash';
import fs from 'fs';

export class TemplateManager {
  /**
   * Read template content
   */
  protected readTemplate(templateName: string): string {
    return fs.readFileSync(
      path.join(__dirname, '../templates', templateName),
      'utf-8',
    );
  }

  /**
   * Render command impl file content
   */
  public renderImplContent(
    implFileName: string,
    type: 'command' | 'event' | 'query',
  ): string {
    const templateContent = this.readTemplate('command-and-event.impl.md');

    return this.stripCodeBlocks(
      templateContent.replace(
        /\$IMPL_CLASS_NAME/g,
        `${upperFirst(camelCase(implFileName))}${upperFirst(type)}`,
      ),
    );
  }

  /**
   * render handler index file content
   */
  public renderHandlerIndexContent(
    handlerFiles: string[],
    handlerVariableName: string,
  ): string {
    const imports = handlerFiles
      .map(
        (file) => `import { ${upperFirst(camelCase(file))} } from './${file}';`,
      )
      .join('\n');

    const handlersInArr = handlerFiles
      .map((file) => `${upperFirst(camelCase(file))},`)
      .join('\n');

    return this.stripCodeBlocks(this.readTemplate('handler-index.md'))
      .replace(/\$IMPORTS/g, imports)
      .replace(/\$HANDLERS/g, handlersInArr)
      .replace(/\$HANDLER_NAME/g, handlerVariableName);
  }

  /**
   * Render handler file content
   */
  public renderCommandHandlerContent(
    commandFileName: string,
    moduleName: string,
  ): string {
    const templateContent = this.readTemplate('command.handler.md');

    return this.stripCodeBlocks(
      templateContent
        .replace(
          /\$IMPL_CLASS_NAME/g,
          `${upperFirst(camelCase(commandFileName))}Command`,
        )
        .replace(
          /\$HANDLER_CLASS_NAME/g,
          `${upperFirst(camelCase(commandFileName))}Handler`,
        )
        .replace(/\$IMPL_FOLDER_NAME/g, `${commandFileName}.impl`)
        .replace(/\$MODULE_NAME/g, moduleName),
    );
  }

  /**
   * Render event handler file content
   */
  renderEventHandlerContent(eventFileName: string, moduleName: string): string {
    const templateContent = this.readTemplate('event.handler.md');
    return this.stripCodeBlocks(
      templateContent
        .replace(
          /\$IMPL_CLASS_NAME/g,
          `${upperFirst(camelCase(eventFileName))}Event`,
        )
        .replace(
          /\$HANDLER_CLASS_NAME/g,
          `${upperFirst(camelCase(eventFileName))}Handler`,
        )
        .replace(/\$IMPL_FOLDER_NAME/g, `${eventFileName}.impl`)
        .replace(/\$MODULE_NAME/g, moduleName),
    );
  }

  /**
   * Render Query handler file content
   */
  renderQueryHandlerContent(queryFileName: string, moduleName: string): string {
    const templateContent = this.readTemplate('query.handler.md');
    return this.stripCodeBlocks(
      templateContent
        .replace(
          /\$IMPL_CLASS_NAME/g,
          `${upperFirst(camelCase(queryFileName))}Query`,
        )
        .replace(
          /\$HANDLER_CLASS_NAME/g,
          `${upperFirst(camelCase(queryFileName))}Handler`,
        )
        .replace(/\$IMPL_FOLDER_NAME/g, `${queryFileName}.impl`)
        .replace(/\$MODULE_NAME/g, moduleName),
    );
  }

  /**
   * Render repository file content
   */
  renderRepositoryContent(repositoryFileName: string): string {
    const templateContent = this.readTemplate('repository.md');
    return this.stripCodeBlocks(
      templateContent.replace(
        /\$REPOSITORY_NAME/g,
        `${upperFirst(camelCase(repositoryFileName))}Repository`,
      ),
    );
  }

  /**
   * Render aggregate model file content
   */
  renderAggregateModelContent(fileName: string) {
    const templateContent = this.readTemplate('aggregate.model.md');
    return this.stripCodeBlocks(
      templateContent.replace(
        /\$AGGREGATE_NAME/g,
        `${upperFirst(camelCase(fileName))}Aggregate`,
      ),
    );
  }

  /**
   * Strip code blocks from the
   */
  protected stripCodeBlocks(template: string): string {
    return template
      .split('\n')
      .filter((line) => line !== '```typescript' && line !== '```')
      .join('\n');
  }
}
