import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCurrentAndNewPasswordEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCurrentAndNewPasswordEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        ...validationOptions,
        message: 'Current password and new password must not be the same',
      },
      validator: {
        validate(value: string, args: ValidationArguments) {
          const propertyValue: string = args.object[property];
          const decoratorOwnerValue: string = value;

          return propertyValue !== decoratorOwnerValue;
        },
      },
    });
  };
}
