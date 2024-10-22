import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDateFormatConstraint
  implements ValidatorConstraintInterface
{
  validate(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    return regex.test(date.split('T')[0]);
  }

  defaultMessage(): string {
    return 'Date format is incorrect. Expected format: [year]-[month]-[day] (e.g. 2024-10-14)';
  }
}

export function IsValidDateStringFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateFormatConstraint,
    });
  };
}
