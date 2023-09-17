import {Injectable} from "@nestjs/common";
import {getRbacBuilder} from "./rbac-builder.service";
import {IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";
import {IRbacPermission, IRbacSection} from "../interfaces/rbac-permission.interface";
import {isNegated, matchGlob} from "../utils/helpers.utils";

export function getRbac(): RbacService {
    return new RbacService();
}

@Injectable()
export class RbacService {
    private builder = getRbacBuilder();

    getSections(): IRbacSection[] {
        return this.builder.getSections();
    }

    getPermissions(): IRbacPermission[] {
        return this.builder.getPermissions();
    }

    validate(request: IRbacValidateRequest, permissions: string[]): boolean {

        // search for items that are negated '!<item>'
        if(this.validatePermissionIsDenied(request.permission, permissions)){
            return false;
        }

        // validate item
        if(this.validatePermissionIsGranted(request.permission, permissions)){
            return true;
        }

        // not validated
        return false;

    }

    private validatePermissionIsGranted(permission: string, permissions: string[]): boolean {
        return permissions.filter(p => this.matchPermission(permission, p)).length > 0;
    }

    private validatePermissionIsDenied(permission: string, permissions: string[]): boolean {
        return permissions.filter(p => isNegated(p) && this.matchPermission(permission, p)).length > 0;
    }

    private matchPermission(permission: string, pattern: string): boolean {
        return matchGlob(permission, pattern);
    }
}