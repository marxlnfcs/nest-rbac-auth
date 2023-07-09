import 'reflect-metadata';
import {RbacVerb} from "../enum/rbac-verb.enum";

const RBAC_GROUP = Symbol('Name of the RBAC group');
const RBAC_RESOURCE = Symbol('Name of the RBAC resource');
const RBAC_VERBS = Symbol('List of RBAC verbs');

export function setMetadata<T>(metadataKey: string|symbol, metadataValue: T, target: Object, propertyKey?: string|symbol) {
    return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
}

export function getMetadata<T = any>(metadataKey: string|symbol, target: Object, propertyKey?: string|symbol) {
    return Reflect.getMetadata(metadataKey, target, propertyKey);
}

export function setGroup(group: string, target: any, propertyKey?: string|symbol): string {
    setMetadata(RBAC_GROUP, group, target, propertyKey);
    return group;
}
export function getGroup(target: any, propertyKey?: string|symbol): string {
    return getMetadata(RBAC_GROUP, target, propertyKey) || null;
}

export function setResource(resource: string, target: any, propertyKey?: string|symbol): string {
    setMetadata(RBAC_RESOURCE, resource, target, propertyKey);
    return resource;
}
export function getResource(target: any, propertyKey?: string|symbol): string|null {
    return getMetadata(RBAC_RESOURCE, target, propertyKey) || null;
}


export function addVerbs(verbs: (RbacVerb|string)[], target: any, propertyKey?: string|symbol): (RbacVerb|string)[] {
    for(let verb of (verbs || [])){
        const verbList = getVerbs(target, propertyKey);
        if(!verbList.filter(v => v.trim().toLowerCase() === verb.trim().toLowerCase()).length){
            setMetadata(RBAC_VERBS, verbList, target, propertyKey);
        }
    }
    return verbs;
}
export function getVerbs(target: any, propertyKey?: string|symbol): (RbacVerb|string)[] {
    return getMetadata(RBAC_VERBS, target, propertyKey) || [];
}