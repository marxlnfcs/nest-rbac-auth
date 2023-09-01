import {applyDecorators, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {IRbacVerbOrList, IRbacVerbs} from "../enum/rbac-verb.enum";
import {createDecorator} from "../utils/decorators.utils";
import {RbacController} from "./rbac-controller.decorator";
import {RbacMethod} from "./rbac-method.decorator";
import {getRbacBuilder} from "../services/rbac-builder.service";
import {addRbacVerbs} from "../utils/metadata.utils";
import {IRbacRequiresOptions} from "../interfaces/rbac-requires-options.interface";
import {RbacRequiresOptions} from "./rbac-requires-options.decorator";
import {IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";

export function RbacRequires(verbOrList: IRbacVerbOrList, options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return applyDecorators(
        RbacController(),
        RbacMethod(),
        RbacRequiresOptions(options),
        createDecorator((target, propertyKey) => {
            addRbacVerbs((Array.isArray(verbOrList) ? verbOrList : [verbOrList]).filter(f => !!f), target, propertyKey);
        })
    );
}

export function RbacRequiresList(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return RbacRequires(['LIST'], options);
}
export function RbacRequiresGet(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return RbacRequires(['GET'], options);
}
export function RbacRequiresCreate(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return RbacRequires(['CREATE'], options);
}
export function RbacRequiresUpdate(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return RbacRequires(['UPDATE'], options);
}
export function RbacRequiresPatch(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return RbacRequires(['PATCH'], options);
}
export function RbacRequiresDelete(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return RbacRequires(['DELETE'], options);
}
export function RbacRequiresDeleteCollection(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return RbacRequires(['DELETECOLLECTION'], options);
}

export const GetRbacVerbs = createParamDecorator<any, any, IRbacVerbs>((_: any, ctx: ExecutionContext) => {
    return getRbacBuilder().getVerbsFromContext(ctx);
});

export const GetRbacRequiresOptions = createParamDecorator<any, any, IRbacRequiresOptions>((_: any, ctx: ExecutionContext) => {
    return getRbacBuilder().getOptionsFromContext(ctx);
});

export const GetRbacRequest = createParamDecorator<any, any, IRbacValidateRequest|null>((_: any, ctx: ExecutionContext) => {
    return getRbacBuilder().getRequestFromContext(ctx);
});