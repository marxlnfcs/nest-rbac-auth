import {applyDecorators} from "@nestjs/common";
import {RbacController} from "./rbac-controller.decorator";
import {createDecorator} from "../utils/decorators.utils";
import {IRbacNode} from "../interfaces/rbac-permission.interface";
import {RbacMethod} from "./rbac-method.decorator";
import {addRbacSections} from "../utils/metadata.utils";
import {joinPath} from "../utils/helpers.utils";

/** @internal */
export function RbacSections(...data: (string|IRbacNode|(string|IRbacNode)[])[]): MethodDecorator & ClassDecorator {
	return applyDecorators(
		RbacController(),
		RbacMethod(),
		createDecorator((target, propertyKey) => {
			addRbacSections(createRbacSections(...data), target, propertyKey);
		})
	)
}

export function RbacSection(path: string|string[], description?: string|null): MethodDecorator & ClassDecorator {
	return RbacSections({
		path: joinPath(path),
		description: description,
	});
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