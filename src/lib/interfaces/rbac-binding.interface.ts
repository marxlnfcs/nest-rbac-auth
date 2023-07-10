import {IRbacVerbs} from "../enum/rbac-verb.enum";

export interface IRbacBinding {
    groups: string[];
    resources: string[];
    resourceNames?: string[];
    verbs: IRbacVerbs;
}