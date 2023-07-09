import {applyDecorators} from "@nestjs/common";
import {setGroup, setResource} from "../utils/metadata.utils";

export function RbacResource(resource: string, group?: string): MethodDecorator & ClassDecorator {
    return applyDecorators(
        function(target: any, propertyKey?: string|symbol) {
            if(group){
                setGroup(group, target, propertyKey);
            }
            setResource(resource, target, propertyKey)
        }
    )
}