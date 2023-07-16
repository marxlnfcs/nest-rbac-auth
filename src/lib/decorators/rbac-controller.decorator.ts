import {applyDecorators} from "@nestjs/common";
import {createDecorator} from "../utils/decorators.utils";
import {addRbacController} from "../rbac.storage";

/** @internal */
export function RbacController(): MethodDecorator & ClassDecorator {
    return applyDecorators(
        createDecorator((target) => {
            addRbacController(target);
        }),
    )
}