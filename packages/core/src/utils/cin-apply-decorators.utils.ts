export function applyDecorators(
  ...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
) {
  return <TFunction extends Function, Y>(
    target: TFunction | object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>
  ) => {
    for (const decorator of decorators) {
      if (propertyKey === undefined) {
        (decorator as ClassDecorator)(target as TFunction);
        continue;
      }
      (decorator as MethodDecorator | PropertyDecorator)(
        target,
        propertyKey,
        descriptor
      );
    }
  };
}
