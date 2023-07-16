import {Injectable} from "@nestjs/common";
import {IRbacGroup} from "../interfaces/rbac-group.interface";
import {getRbacBuilder} from "./rbac-builder.service";
import {IRbacResource} from "../interfaces/rbac-resource.interface";
import {IRbacBinding} from "../interfaces/rbac-binding.interface";
import {IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";

export function getRbac(): RbacService {
    return new RbacService();
}

@Injectable()
export class RbacService {
    private builder = getRbacBuilder();

    getGroups(): IRbacGroup[] {
        return this.builder.getGroups();
    }

    getGroup(groupName: string): IRbacGroup|null {
        return this.builder.getGroups().find(g => g.name.trim().toLowerCase() === groupName.trim().toLowerCase());
    }

    getResources(): IRbacResource[] {
        return this.builder.getResources();
    }

    getResource(resourceName: string, groupName?: string): IRbacResource|null {
        for(let resource of this.builder.getResources()){
            if(!groupName || resource.group.trim().toLowerCase() === groupName.trim().toLowerCase()){
                if(resource.name.trim().toLowerCase() === resourceName.trim().toLowerCase()){
                    return resource;
                }
            }
        }
        return null;
    }

    validate(request: IRbacValidateRequest, bindings: IRbacBinding[]): boolean {
        const resource = this.getResource(request.resource, request.group);
        if(resource){

            // search for item that is especially denied with '-<item>'
            for(let binding of bindings){
                if(
                    this.validateItemIsDenied(resource.group, binding.groups) ||
                    this.validateItemIsDenied(resource.name, binding.resources) ||
                    (request.verbs.filter(verb => this.validateItemIsDenied(verb, binding.verbs)).length) ||
                    (request.resourceName && this.validateItemIsDenied(request.resourceName, binding.resourceNames))
                ){
                    return false;
                }
            }

            // validate item
            for(let binding of bindings){
                if(this.validateItem(resource.group, binding.groups) && this.validateItem(resource.name, binding.resources)){
                    for(let verb of request.verbs){
                        if(this.validateItem(verb, binding.verbs)){
                            if(!request.resourceName || this.validateItem(request.resourceName, binding.resourceNames || ['*'])){
                                return true;
                            }
                        }
                    }
                }
            }

        }
        return false;
    }

    createBinding(binding?: Partial<IRbacBinding>): IRbacBinding {
        return {
            groups: binding?.groups || ['*'],
            resources: binding?.resources || ['*'],
            resourceNames: binding?.resourceNames,
            verbs: binding?.verbs || ['*']
        }
    }

    private validateItem(toValidate: string, validateWith: string[]): boolean {
        toValidate = toValidate.trim().toLowerCase();
        validateWith = validateWith.map(v => v.trim().toLowerCase());
        return !this.validateItemIsDenied(toValidate, validateWith) && (validateWith.includes('*') || validateWith.includes(toValidate));
    }

    private validateItemIsDenied(toValidate: string, validateWith: string[]): boolean {
        toValidate = toValidate.trim().toLowerCase();
        validateWith = validateWith.map(v => v.trim().toLowerCase());
        return validateWith.includes(`-${toValidate}`);
    }
}