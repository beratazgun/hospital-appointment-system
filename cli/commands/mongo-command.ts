import { Command } from 'commander';
import { BaseCommand } from './base-command';
import { glob } from 'glob';
import { camelCase, upperFirst } from 'lodash';
import fs from 'fs';
import { format } from 'prettier';

export class MongoCommand extends BaseCommand {
  public execute(program: Command) {
    program
      .command('generate-schemas')
      .description('mongodb commands')
      .action(async () => {
        const schemaFilesPath = glob.sync('**/*.schema.ts', {
          cwd: process.cwd(),
        });

        let importStatements = '';
        const mapValues: {
          name: string;
          schema: string;
        }[] = [];

        for (const path of schemaFilesPath) {
          const schemaFileName = path.split('/').pop().split('.schema.ts')[0];

          const schemaName = upperFirst(camelCase(schemaFileName)) + 'Schema';
          const schemaFactoryName = schemaName + 'Factory';

          importStatements += `import { ${schemaName}, ${schemaFactoryName} } from '${path.replace('.ts', '')}';`;

          mapValues.push({
            name: schemaName,
            schema: schemaFactoryName,
          });
        }

        importStatements += "import { Schema } from 'mongoose';\n\n";

        const typeFile = `export type MongodbSchemasNameType = ${mapValues
          .map((el) => `'${el.name}'`)
          .join(' | ')};\n\n`;

        const mapVariable = `export const MONGODB_SCHEMAS_MAP = new Map<MongodbSchemasNameType, { name: string; schema: Schema }>([${mapValues
          .map(
            (el) => `['${el.name}', {
          name: ${el.name}.name,
          schema: ${el.schema},
           }]`,
          )
          .join(',\n')}]);`;

        fs.writeFileSync(
          './libs/common/src/modules/mongodb/index.ts',
          await format(importStatements + typeFile + mapVariable, {
            parser: 'typescript',
            singleQuote: true,
          }),
        );
      });
  }
}
