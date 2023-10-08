import {applyDecorators} from "@nestjs/common";
import {RbacController} from "./rbac-controller.decorator";
import {createDecorator} from "../utils/decorators.utils";
import {IRbacNode} from "../interfaces/rbac-permission.interface";
import {RbacMethod} from "./rbac-method.decorator";
import {addRbacSections} from "../utils/metadata.utils";
import {joinPath} from "../utils/helpers.utils";

export type RbacSectionPath = string|string[];
export type RbacSectionDescription = string|null|undefined;

export function RbacSections(...data: ([RbacSectionPath, RbacSectionDescription])[]): MethodDecorator & ClassDecorator {
	return applyDecorators(
		RbacController(),
		RbacMethod(),
		createDecorator((target, propertyKey) => {
			addRbacSections(createRbacSections(...data.map(([path, description]) => ({
				path: joinPath(path),
				description: description,
			}))), target, propertyKey);
		})
	)
}

export function RbacSection(path: RbacSectionPath, description?: RbacSectionDescription): MethodDecorator & ClassDecorator {
	return RbacSections([ path, description ]);
}

/** @internal */
export function createRbacSections(...data: (string|IRbacNode|(string|IRbacNode)[])[]): IRbacNode[] {
	const sections: IRbacNode[] = [];
	data.map(i => {
		if(Array.isArray(i)) return i.map(i2 => sections.push(createRbacSection(i2)));
		sections.push(createRbacSection(i));
	});
	return sections;
}

/** @internal */
export function createRbacSection(path: string|IRbacNode): IRbacNode {
	return typeof path === 'string' ? { path: path } : path;
}