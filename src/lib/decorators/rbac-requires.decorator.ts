import {applyDecorators, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {createDecorator} from "../utils/decorators.utils";
import {RbacController} from "./rbac-controller.decorator";
import {RbacMethod} from "./rbac-method.decorator";
import {getRbacBuilder} from "../services/rbac-builder.service";
import {IRbacRequiresOptions} from "../interfaces/rbac-requires-options.interface";
import {RbacRequiresOptions} from "./rbac-requires-options.decorator";
import {IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";
import {extractObject, extractString} from "../utils/helpers.utils";
import {setRbacPermission} from "../utils/metadata.utils";

export function RbacRequires(path: string|string[], options?: Partial<IRbacRequiresOptions>): MethodDecorator;
export function RbacRequires(path: string|string[], description?: string, options?: Partial<Omit<IRbacRequiresOptions, 'description'>>): MethodDecorator;
export function RbacRequires(path: string|string[], descOrOpts?: string|Partial<IRbacRequiresOptions>, opts?: Partial<IRbacRequiresOptions>): MethodDecorator {
    const options: Partial<IRbacRequiresOptions> = extractObject(descOrOpts, opts, {});
    return applyDecorators(
        RbacController(),
        RbacMethod(),
        RbacRequiresOptions({
            description: extractString(descOrOpts, options?.description),
            skipValidation: options?.skipValidation,
            meta: options?.meta,
        }),
        createDecorator((target, propertyKey) => {
          setRbacPermission((Array.isArray(path) ? path : [path]).filter(f => !!f), target, propertyKey);
        })
    );
}

export function RbacRequiresList(options?: Partial<IRbacRequiresOptions>): MethodDecorator;
export function RbacRequiresList(description: string, options?: Partial<Omit<IRbacRequiresOptions, 'description'>>): MethodDecorator;
export function RbacRequiresList(descriptionOrOptions?: string|Partial<IRbacRequiresOptions>, options?: Partial<IRbacRequiresOptions>): MethodDecorator {
    return RbacRequires(['list'], descriptionOrOptions as any, options);
}
export function RbacRequiresGet(options?: Partial<IRbacRequiresOptions>): MethodDecorator;
export function RbacRequiresGet(description: string, options?: Partial<Omit<IRbacRequiresOptions, 'description'>>): MethodDecorator;
export function RbacRequiresGet(descriptionOrOptions?: string|Partial<IRbacRequiresOptions>, options?: Partial<IRbacRequiresOptions>): MethodDecorator {
    return RbacRequires(['get'], descriptionOrOptions as any, options);
}
export function RbacRequiresCreate(options?: Partial<IRbacRequiresOptions>): MethodDecorator;
export function RbacRequiresCreate(description: string, options?: Partial<Omit<IRbacRequiresOptions, 'description'>>): MethodDecorator;
export function RbacRequiresCreate(descriptionOrOptions?: string|Partial<IRbacRequiresOptions>, options?: Partial<IRbacRequiresOptions>): MethodDecorator {
    return RbacRequires(['create'], descriptionOrOptions as any, options);
}
export function RbacRequiresUpdate(options?: Partial<IRbacRequiresOptions>): MethodDecorator;
export function RbacRequiresUpdate(description: string, options?: Partial<Omit<IRbacRequiresOptions, 'description'>>): MethodDecorator;
export function RbacRequiresUpdate(descriptionOrOptions?: string|Partial<IRbacRequiresOptions>, options?: Partial<IRbacRequiresOptions>): MethodDecorator {
    return RbacRequires(['update'], descriptionOrOptions as any, options);
}
export function RbacRequiresDelete(options?: Partial<IRbacRequiresOptions>): MethodDecorator;
export function RbacRequiresDelete(description: string, options?: Partial<Omit<IRbacRequiresOptions, 'description'>>): MethodDecorator;
export function RbacRequiresDelete(descriptionOrOptions?: string|Partial<IRbacRequiresOptions>, options?: Partial<IRbacRequiresOptions>): MethodDecorator {
    return RbacRequires(['delete'], descriptionOrOptions as any, options);
}

export const GetRbacRequest = createParamDecorator<any, any, IRbacValidateRequest|null>((_: any, ctx: ExecutionContext) => {
    return getRbacBuilder().getRequestFromContext(ctx);
});