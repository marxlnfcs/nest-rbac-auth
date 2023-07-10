import {applyDecorators, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {setRbacGroup, setRbacResource} from "../utils/metadata.utils";
import {createDecorator} from "../utils/decorators.utils";
import {RbacController} from "./rbac-controller.decorator";
import {RbacMethod} from "./rbac-method.decorator";
import {getRbacBuilder} from "../services/rbac-builder.service";
import {IRbacResource} from "../interfaces/rbac-resource.interface";

export function RbacResource(resource: string, group?: string): MethodDecorator & ClassDecorator {
    return applyDecorators(
        RbacController(),
        RbacMethod(),
        createDecorator((target, propertyKey) => {
            if(group){
                setRbacGroup(group, target, propertyKey);
            }
            setRbacResource(resource, target, propertyKey);
        })
    )
}

export const GetRbacResource = createParamDecorator<any, any, IRbacResource|null>((_: any, ctx: ExecutionContext) => {
    return getRbacBuilder().getResourceFromContext(ctx);
});