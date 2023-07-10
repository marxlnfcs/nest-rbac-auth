import {IRbacVerbs} from "../enum/rbac-verb.enum";

export interface IRbacResource {
    group: string;
    name: string;
    verbs: IRbacVerbs;
}