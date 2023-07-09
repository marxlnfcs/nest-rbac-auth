import {RbacGroup} from "./interfaces/rbac-group.interface";
import {RbacResource} from "./interfaces/rbac-resource.interface";

/** @internal */
const rbacGroups: RbacGroup[] = [];

/** @internal */
export function addRbacGroup(name: string, resources?: RbacResource[]): RbacGroup {
    if(!rbacGroups.filter(g => g.name.trim().toLowerCase() === name.trim().toLowerCase()).length){
        rbacGroups.push({
            name: name.trim(),
            resources: []
        });
    }
    if(Array.isArray(resources)){
        const group = rbacGroups.find(g => g.name.trim().toLowerCase() === name.trim().toLowerCase());
        for(let resource of resources){
            const existingResource = group.resources.find(r => r.name.trim().toLowerCase() === resource.name.trim().toLowerCase());
            if(existingResource){
                const verbs = resource.verbs.map(v => v.trim().toUpperCase());
                verbs.filter(v => !existingResource.verbs.includes(v as any)).map(v => existingResource.verbs.push(v as any));
            }else{
                group.resources.push({
                    name: resource.name,
                    verbs: (resource.verbs || []).map(v => v.trim().toUpperCase()) as any[]
                });
            }
        }
    }
    return getRbacGroup(name);
}

/** @internal */
export function getRbacGroup(name: string): RbacGroup {
    return rbacGroups.find(g => g.name.toLowerCase() === name.trim().toLowerCase()) || addRbacGroup(name);
}

/** @internal */
export function addRbacResource(group: string, resource: RbacResource): RbacResource {
    const rbacGroup = getRbacGroup(group);
    if(!rbacGroup.resources.filter(r => r.name.toLowerCase() === resource.name.trim().toLowerCase()).length){
        rbacGroup.resources.push({
            name: resource.name.trim(),
            verbs: resource.verbs.map(v => v.toUpperCase()) as any[],
        });
    }
    const rbacResource = getRbacResource(group, resource.name);
    resource.verbs.map(verb => {
        if(!rbacResource.verbs.includes(verb)){
            rbacResource.verbs.push(verb);
        }
    });
    return resource;
}

/** @internal */
export function getRbacResource(group: string, name: string): RbacResource {
    const rbacGroup = getRbacGroup(group);
    return rbacGroup.resources.find(r => r.name.toLowerCase() === name.trim().toLowerCase()) || addRbacResource(rbacGroup.name, {
        name: name,
        verbs: []
    });
}