import {applyDecorators, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {IRbacVerbOrList, IRbacVerbs} from "../enum/rbac-verb.enum";
import {createDecorator} from "../utils/decorators.utils";
import {RbacController} from "./rbac-controller.decorator";
import {RbacMethod} from "./rbac-method.decorator";
import {getRbacBuilder} from "../services/rbac-builder.service";
import {addRbacVerbs} from "../utils/metadata.utils";

export function RbacRequires(verbOrList: IRbacVerbOrList): MethodDecorator & ClassDecorator {
    return applyDecorators(
        RbacController(),
        RbacMethod(),
        createDecorator((target, propertyKey) => {
            addRbacVerbs((Array.isArray(verbOrList) ? verbOrList : [verbOrList]).filter(f => !!f), target, propertyKey);
        })
    );
}

export function RbacRequiresList(): MethodDecorator & ClassDecorator {
    return RbacRequires(['LIST']);
}
export function RbacRequiresGet(): MethodDecorator & ClassDecorator {
    return RbacRequires(['GET']);
}
export function RbacRequiresCreate(): MethodDecorator & ClassDecorator {
    return RbacRequires(['CREATE']);
}
export function RbacRequiresUpdate(): MethodDecorator & ClassDecorator {
    return RbacRequires(['UPDATE']);
}
export function RbacRequiresPatch(): MethodDecorator & ClassDecorator {
    return RbacRequires(['PATCH']);
}
export function RbacRequiresDelete(): MethodDecorator & ClassDecorator {
    return RbacRequires(['DELETE']);
}
export function RbacRequiresDeleteCollection(): MethodDecorator & ClassDecorator {
    return RbacRequires(['DELETECOLLECTION']);
}

export const GetRbacVerbs = createParamDecorator<any, any, IRbacVerbs>((_: any, ctx: ExecutionContext) => {
    return getRbacBuilder().getVerbsFromContext(ctx);
});