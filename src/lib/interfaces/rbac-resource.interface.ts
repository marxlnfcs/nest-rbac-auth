import {RbacVerb} from "../enum/rbac-verb.enum";

export interface RbacResource {
    name: string;
    verbs: RbacVerb[];
}