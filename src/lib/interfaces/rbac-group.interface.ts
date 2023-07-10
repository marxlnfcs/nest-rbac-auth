import {IRbacResource} from "./rbac-resource.interface";

export interface IRbacGroup {
    name: string;
    resources: IRbacResource[];
}