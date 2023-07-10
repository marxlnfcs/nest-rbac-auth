import {ExecutionContext, Injectable} from "@nestjs/common";
import {IRbacGroup} from "../interfaces/rbac-group.interface";
import {getRbacControllers} from "../rbac.storage";
import {getRbacGroup, getRbacMethods, getRbacResource, getRbacVerbs} from "../utils/metadata.utils";
import {IRbacVerbOrString, IRbacVerbs} from "../enum/rbac-verb.enum";
import {IRbacResource} from "../interfaces/rbac-resource.interface";

/** @internal */
export function getRbacBuilder(): RbacBuilderService {
    return new RbacBuilderService();
}

/** @internal */
@Injectable()
export class RbacBuilderService {
    private groups: IRbacGroup[] = [];

    getGroups(): IRbacGroup[] {
        return this.createGroups();
    }

    getResources(): IRbacResource[] {
        const resources: IRbacResource[] = [];
        for(let group of this.getGroups()){
            resources.push(...group.resources);
        }
        return resources;
    }

    createGroups(): IRbacGroup[] {
        this.groups = [];
        for(let controller of getRbacControllers()){
            for(let method of getRbacMethods(controller)){
                const info = this.getResourceInfo(controller, method);

                if(info.group && info.resource && info.verbs.length){
                    this.getOrCreateGroup(info.group);
                    this.getOrCreateResource(info.group, info.resource as string);
                    this.getOrCreateVerbs(info.group, info.resource as string, info.verbs);
                }
            }
        }
        return this.groups;
    }

    getGroupFromContext(context: ExecutionContext): IRbacGroup|null {
        const [ controller, method ] = [ context.getClass(), context.getHandler().name ];
        if(controller && method){
            const info = this.getResourceInfo(controller, method);
            for(let group of this.getGroups()){
                if(group.name.trim().toLowerCase() === info.group.trim().toLowerCase()){
                    return group;
                }
            }
        }
        return null;
    }

    getResourceFromContext(context: ExecutionContext): IRbacResource|null {
        const [ controller, method ] = [ context.getClass(), context.getHandler().name ];
        if(controller && method){
            const info = this.getResourceInfo(controller, method);
            for(let resource of this.getResources()){
                if(resource.group.trim().toLowerCase() === info.group.trim().toLowerCase() && resource.name.trim().toLowerCase() === info.resource.trim().toLowerCase()){
                    return resource;
                }
            }
        }
        return null;
    }

    getVerbsFromContext(context: ExecutionContext): IRbacVerbs {
        const [ controller, method ] = [ context.getClass(), context.getHandler().name ];
        return this.getResourceInfo(controller, method)?.verbs || [];
    }

    private getResourceInfo(controller: any, method: string|symbol): { group: string, resource: string, verbs: IRbacVerbs } {
        const group = this.extractGroupName(controller, method);
        const resource = this.extractResourceName(controller, method);
        const verbs = this.extractResourceVerbs(controller, method);
        return { group, resource: resource?.toString(), verbs };
    }

    private getOrCreateGroup(groupName: string): IRbacGroup {
        const searchFilter = (g: IRbacGroup) => g.name.trim().toLowerCase() === groupName.trim().toLowerCase();
        if(!this.groups.filter(searchFilter).length){
            this.groups.push({
                name: groupName.trim(),
                resources: []
            });
        }
        return this.groups.find(searchFilter);
    }

    private getOrCreateResource(groupName: string, resourceName: string): IRbacResource {
        const searchFilter = (r: IRbacResource) => r.name.trim().toLowerCase() === resourceName.trim().toLowerCase();
        const group = this.getOrCreateGroup(groupName);
        if(!group.resources.filter(searchFilter).length){
            group.resources.push({
                group: group.name,
                name: resourceName,
                verbs: []
            });
        }
        return group.resources.find(searchFilter);
    }

    private getOrCreateVerbs(groupName: string, resourceName: string, verbList: IRbacVerbs): IRbacVerbs {
        const searchFilter = (resourceVerb: IRbacVerbOrString, verb: IRbacVerbOrString) => resourceVerb.trim().toLowerCase() === verb.trim().toLowerCase();
        const group = this.getOrCreateGroup(groupName);
        const resource = this.getOrCreateResource(group.name, resourceName);
        for(let verb of verbList){
            if(!resource.verbs.filter(v => searchFilter(v, verb)).length){
                resource.verbs.push(verb);
            }
        }
        return verbList;
    }

    private extractGroupName(controller: any, propertyKey?: string|symbol): string|null {
        return getRbacGroup(controller, propertyKey) || getRbacGroup(controller) || controller?.prototype?.constructor?.name || controller?.constructor?.name || null;
    }

    private extractResourceName(controller: any, propertyKey?: string|symbol): string|symbol|null {
        return getRbacResource(controller, propertyKey) || getRbacResource(controller) || propertyKey || null;
    }

    private extractResourceVerbs(controller: any, propertyKey?: string|symbol): IRbacVerbs {
        return Array.from(new Set([ ...getRbacVerbs(controller, propertyKey), ...getRbacVerbs(controller) ]));
    }
}