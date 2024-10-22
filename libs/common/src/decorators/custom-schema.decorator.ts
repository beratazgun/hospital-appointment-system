import { Type } from '@nestjs/common';
import { Schema as NestSchema, SchemaOptions } from '@nestjs/mongoose';
import { applyDecorators } from '@nestjs/common';
import { camelCase, upperFirst } from 'lodash';

type CustomSchemaOptions = SchemaOptions & {
  databaseName: string;
};

function validateSchemaName(collection: string, schemaName: string) {
  const shouldSchemaName = upperFirst(camelCase(collection)) + 'Schema';

  if (shouldSchemaName !== schemaName) {
    throw new Error(
      `Schema name should be '${shouldSchemaName}' but got '${schemaName}'`,
    );
  }
}

export function CustomSchema(schemaOptions: CustomSchemaOptions) {
  return applyDecorators(
    NestSchema({
      timestamps: true,
      toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
          delete ret._id;
          delete ret.__v;
          return ret;
        },
      },
      ...schemaOptions,
    }),
    (target: Type<any>) => {
      validateSchemaName(schemaOptions.collection, target.name);
    },
  );
}
