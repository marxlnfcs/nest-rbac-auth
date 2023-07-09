import {applyDecorators} from "@nestjs/common";
import {setGroup} from "../utils/metadata.utils";

export function RbacGroup(name: string): MethodDecorator & ClassDecorator {
    return applyDecorators(
        function(target: any, propertyKey?: string|symbol) {
            setGroup(name, target, propertyKey);
        }
    )
}