import {ExecutionContext, Injectable} from "@nestjs/common";
import {getRbacControllers} from "../rbac.storage";
import {IRbacRequiresOptions} from "../interfaces/rbac-requires-options.interface";
import {IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";
import {IRbacNode, IRbacPermission, IRbacSection} from "../interfaces/rbac-permission.interface";
import {getRbacMethods, getRbacPermission, getRbacRequiresOptions, getRbacSections} from "../utils/metadata.utils";
import {joinPath} from "../utils/helpers.utils";

/** @internal */
export function getRbacBuilder(): RbacBuilderService {
    return new RbacBuilderService();
}

/** @internal */
@Injectable()
export class RbacBuilderService {
    private sections: IRbacSection[] = [];
    private permissions: IRbacPermission[] = [];

    getSections(): IRbacSection[] {
        if(this.sections.length){
            return this.sections;
        }
        return this.createSections();
    }

    getPermissions(): IRbacPermission[] {
        if(this.permissions.length){
            return this.permissions;
        }
        return this.createPermissions();
    }

    private createSections(): IRbacSection[] {
        this.sections = [];
        for(let controller of getRbacControllers()) {
            for(let method of getRbacMethods(controller)){

                // create variable for current section and current parent path
                let section: IRbacSection;
                let path: string;

                // create sections
                for(let node of this.extractSections(controller, method)){
                    section = this.getOrCreateSection(joinPath(path, node.path), section?.sections || this.sections);
                    section.description = node.description || section.description;
                    path = section.path;
                }

                // skip if no section is set
                if(!section){
                    continue;
                }

                // create permissions
                Object.assign(this.getOrCreatePermission(joinPath(path, this.extractPermission(controller, method)), section.permissions), {
                    description: this.extractRequiresOptions(controller, method)?.description,
                });

            }
        }
        return this.sections;
    }

    private createPermissions(): IRbacPermission[] {
        this.permissions = [];
        for(let controller of getRbacControllers()) {
            for(let method of getRbacMethods(controller)){
                const options = this.extractRequiresOptions(controller, method);
                const permission = this.getOrCreatePermission(joinPath(this.extractSections(controller, method).map(s => s.path), this.extractPermission(controller, method)), this.permissions);
                permission.description = options?.description || permission.description;
            }
        }
        return this.permissions;
    }

    private getOrCreateSection(path: string, sections: IRbacSection[]): IRbacSection {
        if(!sections.filter(s => s.path === path).length){
            sections.push({
                path: path,
                sections: [],
                permissions: [],
            });
        }
        return sections.find(s => s.path === path);
    }

    private getOrCreatePermission(path: string, permissions: IRbacPermission[]): IRbacPermission {
        if(!permissions.filter(p => p.path === path).length){
            permissions.push({ path });
        }
        return permissions.find(p => p.path === path);
    }

    getRequestFromContext(context: ExecutionContext): IRbacValidateRequest|null {
        const [ controller, method ] = [ context.getClass(), context.getHandler().name ];
        if(controller && method){
            const info = this.getMethodInfo(controller, method);
            if(!info.paths.length){
              return null;
            }
            const request: IRbacValidateRequest = {
                permission: joinPath(...info.sections.map(r => r.path), ...info.paths),
                options: info.options,
            };
            return request.permission ? request : null;
        }
        return null;
    }

    private getMethodInfo(controller: any, method: string|symbol): { sections: IRbacNode[], paths: string[], options: IRbacRequiresOptions } {
        const sections = this.extractSections(controller, method);
        const paths = this.extractPermission(controller, method);
        const options = this.extractRequiresOptions(controller, method);
        return { sections, paths, options };
    }

    private extractSections(controller: any, propertyKey?: string|symbol): IRbacNode[] {
        return [ ...[...getRbacSections(controller)].reverse(), ...[...getRbacSections(controller, propertyKey)].reverse() ];
    }

    private extractPermission(controller: any, propertyKey?: string|symbol): string[] {
        return getRbacPermission(controller, propertyKey);
    }

    private extractRequiresOptions(controller: any, propertyKey?: string|symbol): IRbacRequiresOptions {
        return getRbacRequiresOptions(controller, propertyKey);
    }
}