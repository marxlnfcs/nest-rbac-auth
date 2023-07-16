import {CanActivate, ExecutionContext, mixin, Type} from "@nestjs/common";
import {IRbacResource} from "../interfaces/rbac-resource.interface";
import {Observable} from "rxjs";
import {getRbac} from "../services/rbac.service";
import {memoize} from "../utils/memoize.utils";
import {IRbacValidateContext, IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";
import {getRbacBuilder} from "../services/rbac-builder.service";
import {IRbacBinding} from "../interfaces/rbac-binding.interface";

export interface IRbacValidationGuard<Metadata extends object = any> {
    validate(request: IRbacValidateRequest<Metadata>, resource: IRbacResource, context: IRbacValidateContext): boolean|Promise<boolean>|Observable<boolean>;
    validateRequest(request: IRbacValidateRequest<Metadata>, bindings: IRbacBinding[]): boolean;
}

export const RbacGuard: <Metadata extends object = any>() => Type<IRbacValidationGuard<Metadata>> = memoize(createRbacGuard);

function createRbacGuard(): Type<IRbacValidationGuard> {
    class MixinRbacGuard implements CanActivate, IRbacValidationGuard {
        private rbac = getRbac();
        private rbacBuilder = getRbacBuilder();

        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const http = context.switchToHttp();
            const resource = this.rbacBuilder.getResourceFromContext(context);
            const verbs = this.rbacBuilder.getVerbsFromContext(context);
            const options = this.rbacBuilder.getOptionsFromContext(context);
            if(resource && !options.skipValidation){
                return this.validate(
                    { group: resource.group, resource: resource.name, verbs, options },
                    resource,
                    { context, request: http.getRequest(), response: http.getResponse() }
                );
            }
            return true;
        }

        validate(request: IRbacValidateRequest, resource: IRbacResource, context: IRbacValidateContext): boolean|Promise<boolean>|Observable<boolean> {
            return this.validateRequest(request, []);
        }

        validateRequest(request: IRbacValidateRequest, bindings: IRbacBinding[]): boolean {
            return this.rbac.validate(request, bindings);
        }
    }
    return mixin(MixinRbacGuard) as any;
}