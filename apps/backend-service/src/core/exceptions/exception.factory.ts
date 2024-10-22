import { ValidationError } from '@nestjs/common';

function exceptionFactory(errors: ValidationError[], parentField: string = '') {
  return errors.flatMap((error) => {
    const field = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      return Object.values(error.constraints).map((constraint) => ({
        field,
        message: constraint,
      }));
    }

    if (error.children && error.children.length > 0) {
      return exceptionFactory(error.children, field);
    }

    return [];
  });
}

export { exceptionFactory };
