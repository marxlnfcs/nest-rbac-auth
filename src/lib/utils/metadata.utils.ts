import 'reflect-metadata';
import {IRbacVerbs} from "../enum/rbac-verb.enum";
import {RBAC_GROUP, RBAC_METHODS, RBAC_RESOURCE, RBAC_VERBS} from "../rbac.constants";

export function setMetadata<T>(metadataKey: string|symbol, metadataValue: T, target: Object, propertyKey?: string|symbol) {
    return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
}

export function getMetadata<T = any>(metadataKey: string|symbol, target: Object, propertyKey?: string|symbol) {
    return Reflect.getMetadata(metadataKey, target, propertyKey);
}

export function addRbacMethod(target: any, propertyKey: string|symbol): void {
    const methodList = getRbacMethods(target.prototype || target);
    if(!methodList.includes(propertyKey)){
        methodList.push(propertyKey);
        setMetadata(RBAC_METHODS, methodList, target.prototype || target);
    }
}

export function getRbacMethods(target: any): (string|symbol)[] {
    return getMetadata(RBAC_METHODS, target.prototype || target) || [];
}

export function setRbacGroup(group: string, target: any, propertyKey?: string|symbol): string {
    setMetadata(RBAC_GROUP, group, target.prototype || target, propertyKey);
    return group;
}
export function getRbacGroup(target: any, propertyKey?: string|symbol): string {
    return getMetadata(RBAC_GROUP, target.prototype || target, propertyKey) || null;
}

export function setRbacResource(resource: string, target: any, propertyKey?: string|symbol): string {
    setMetadata(RBAC_RESOURCE, resource, target.prototype || target, propertyKey);
    return resource;
}
export function getRbacResource(target: any, propertyKey?: string|symbol): string|null {
    return getMetadata(RBAC_RESOURCE, target.prototype || target, propertyKey) || null;
}


export function addRbacVerbs(verbs: IRbacVerbs, target: any, propertyKey?: string|symbol): IRbacVerbs {
    for(let verb of (verbs || [])){
        const verbList = getRbacVerbs(target.prototype || target, propertyKey);
        if(!verbList.filter(v => v.trim().toLowerCase() === verb.trim().toLowerCase()).length){
            verbList.push(verb);
            setMetadata(RBAC_VERBS, verbList, target.prototype || target, propertyKey);
        }
    }
    return verbs;
}
export function getRbacVerbs(target: any, propertyKey?: string|symbol): IRbacVerbs {
    return getMetadata(RBAC_VERBS, target.prototype || target, propertyKey) || [];
}