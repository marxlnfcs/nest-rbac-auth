import {applyDecorators} from "@nestjs/common";
import {createDecorator} from "../utils/decorators.utils";
import {setRbacRequiresOptions} from "../utils/metadata.utils";
import {IRbacRequiresOptions} from "../interfaces/rbac-requires-options.interface";

/** @internal */
export function RbacRequiresOptions(options?: Partial<IRbacRequiresOptions>): MethodDecorator & ClassDecorator {
    return applyDecorators(
        createDecorator((target, propertyKey) => {
            setRbacRequiresOptions(target, propertyKey, options);
        }),
    )
}