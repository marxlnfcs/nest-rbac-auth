import {applyDecorators} from "@nestjs/common";
import {RbacVerb} from "../enum/rbac-verb.enum";
import {addVerbs} from "../utils/metadata.utils";

export function RbacRequires(verbOrList: RbacVerb|string|(RbacVerb|string)[]): MethodDecorator & ClassDecorator {
    return applyDecorators(
        function(target: any, propertyKey?: string|symbol) {
            addVerbs((Array.isArray(verbOrList) ? verbOrList : [verbOrList]).filter(f => !!f), target, propertyKey);
        }
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