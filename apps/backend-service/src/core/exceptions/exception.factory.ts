import { ValidationError } from '@nestjs/common';

export type MetadataKey = 'EXTRA_FIELDS';

function exceptionFactory(errors: ValidationError[], parentField: string = '') {
  return errors.flatMap((error) => {
    console.log(errors);
    const field = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      return Object.values(error.constraints).map((constraint) => {
        return {
          field,
          isValid: false,
          message: constraint,
        };
      });
    }

    /**
     * If the error has children, it means that the error is a nested object. Recursively call the exceptionFactory
     */
    if (error.children && error.children.length > 0) {
      return exceptionFactory(error.children, field);
    }

    return [];
  });
}

export { exceptionFactory };
