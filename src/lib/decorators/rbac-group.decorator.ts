import {applyDecorators, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {setRbacGroup} from "../utils/metadata.utils";
import {createDecorator} from "../utils/decorators.utils";
import {RbacController} from "./rbac-controller.decorator";
import {RbacMethod} from "./rbac-method.decorator";
import {getRbacBuilder} from "../services/rbac-builder.service";
import {IRbacGroup} from "../interfaces/rbac-group.interface";

export function RbacGroup(name: string): MethodDecorator & ClassDecorator {
    return applyDecorators(
        RbacController(),
        RbacMethod(),
        createDecorator((target, propertyKey) => {
            setRbacGroup(name, target, propertyKey);
        }),
    )
}

export const GetRbacGroup = createParamDecorator<any, any, IRbacGroup|null>((_: any, ctx: ExecutionContext) => {
    return getRbacBuilder().getGroupFromContext(ctx);
});