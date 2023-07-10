import {applyDecorators} from "@nestjs/common";
import {createDecorator} from "../utils/decorators.utils";
import {addRbacMethod} from "../utils/metadata.utils";

export function RbacMethod(): MethodDecorator & ClassDecorator {
    return applyDecorators(
        createDecorator((target, propertyKey) => {
            if(propertyKey){
                addRbacMethod(target, propertyKey);
            }
        }),
    )
}