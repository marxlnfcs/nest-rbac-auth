import {RbacVerb} from "../enum/rbac-verb.enum";

export interface RbacBinding {
    group: string;
    resource: string;
    resourceName?: string[];
    verbs: RbacVerb[];
}