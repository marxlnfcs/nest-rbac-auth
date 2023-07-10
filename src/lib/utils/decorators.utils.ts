/** @internal */
export function createDecorator(decorator: (target: any, propertyKey?: string|symbol, descriptor?: TypedPropertyDescriptor<any>) => void): ClassDecorator & MethodDecorator & PropertyDecorator {
    return (target: any, propertyKey?: string|symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        decorator(target, propertyKey, descriptor);
    };
}