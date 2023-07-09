import {RbacResource} from "./rbac-resource.interface";

export interface RbacGroup {
    name: string;
    resources: RbacResource[];
}