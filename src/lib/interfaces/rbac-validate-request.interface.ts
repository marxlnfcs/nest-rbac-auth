import {IRbacVerbs} from "../enum/rbac-verb.enum";

export interface IRbacValidateRequest {
    group: string;
    resource: string;
    resourceName?: string;
    verbs: IRbacVerbs;
}