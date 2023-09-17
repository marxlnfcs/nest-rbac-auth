import 'reflect-metadata';
import {RBAC_METHODS, RBAC_PERMISSION, RBAC_REQUIRES_OPTIONS, RBAC_SECTIONS} from "../rbac.constants";
import {IRbacRequiresOptions} from "../interfaces/rbac-requires-options.interface";
import {IRbacNode} from "../interfaces/rbac-permission.interface";

export function setMetadata<T>(metadataKey: string|symbol, metadataValue: T, target: Object, propertyKey?: string|symbol) {
	return Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
}

export function addMetadata<T>(metadataKey: string|symbol, metadataValue: T[], target: Object, propertyKey?: string|symbol) {
	if(Array.isArray(metadataValue)){
		let data = getMetadata<T[]>(metadataKey, target, propertyKey);
		data = Array.isArray(data) ? data : [];
		metadataValue.map(v => data.push(v));
		return setMetadata<T[]>(metadataKey, data, target, propertyKey);
	}
}

export function getMetadata<T = any>(metadataKey: string|symbol, target: Object, propertyKey?: string|symbol): T {
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

export function addRbacSections(sections: IRbacNode[], target: Object, propertyKey?: string|symbol) {
	addMetadata(RBAC_SECTIONS, sections, target, propertyKey);
}

export function getRbacSections(target: Object, propertyKey?: string|symbol): IRbacNode[] {
	const sections: IRbacNode[] = getMetadata(RBAC_SECTIONS, target, propertyKey);
	return Array.isArray(sections) ? sections : [];
}

export function setRbacPermission(permissions: string[], target: any, propertyKey?: string|symbol): string[] {
	setMetadata(RBAC_PERMISSION, permissions || [], target.prototype || target, propertyKey);
	return permissions;
}
export function getRbacPermission(target: any, propertyKey?: string|symbol): string[] {
	return getMetadata(RBAC_PERMISSION, target.prototype || target, propertyKey) || [];
}

export function setRbacRequiresOptions(target: any, propertyKey?: string|symbol, options?: Partial<IRbacRequiresOptions>): void {
	setMetadata(RBAC_REQUIRES_OPTIONS, options || {}, target.prototype || target, propertyKey);
}

export function getRbacRequiresOptions(target: any, propertyKey?: string|symbol): IRbacRequiresOptions {
	const options = getMetadata(RBAC_REQUIRES_OPTIONS, target.prototype || target, propertyKey) as Partial<IRbacRequiresOptions>;
	return {
		description: options?.description || null,
		skipValidation: options?.skipValidation ?? false,
		meta: options?.meta || {},
	}
}