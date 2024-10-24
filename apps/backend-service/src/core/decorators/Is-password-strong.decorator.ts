import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

export function IsPasswordStrong(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordStrong',
      target: object.constructor,
      propertyName,
      constraints: [
        {
          message: (constraints: ValidationArguments['constraints']) => {
            return constraints;
          },
        },
      ],
      options: {
        message: (validationArguments) => {
          const [warning] = validationArguments.constraints;

          return warning.message;
        },
        ...validationOptions,
      },
      validator: {
        async validate(value: string, args: ValidationArguments) {
          if (!value) {
            return false;
          }

          zxcvbnOptions.setOptions({
            translations: zxcvbnEnPackage.translations,
            graphs: zxcvbnCommonPackage.adjacencyGraphs,
            dictionary: {
              ...zxcvbnCommonPackage.dictionary,
              ...zxcvbnEnPackage.dictionary,
            },
          });

          const { score, feedback } = await zxcvbnAsync(value);

          args.constraints[0].message =
            feedback.warning + ' ' + feedback.suggestions.join(' ');

          if (score < 3) {
            return false;
          } else {
            return true;
          }
        },
      },
    });
  };
}
