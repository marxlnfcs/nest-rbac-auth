import {CanActivate, ExecutionContext, mixin, Type} from "@nestjs/common";
import {Observable} from "rxjs";
import {getRbac} from "../services/rbac.service";
import {memoize} from "../utils/memoize.utils";
import {IRbacValidateContext, IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";
import {getRbacBuilder} from "../services/rbac-builder.service";

export interface IRbacValidationGuard<Metadata extends object = any> {
    validate(request: IRbacValidateRequest<Metadata>, context: IRbacValidateContext): boolean|Promise<boolean>|Observable<boolean>;
    validateRequest(request: IRbacValidateRequest<Metadata>, permissions: string[]): boolean;
}

export const RbacGuard: <Metadata extends object = any>() => Type<IRbacValidationGuard<Metadata>> = memoize(createRbacGuard);

function createRbacGuard(): Type<IRbacValidationGuard> {
    class MixinRbacGuard implements CanActivate, IRbacValidationGuard {
        private rbac = getRbac();
        private rbacBuilder = getRbacBuilder();

        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const http = context.switchToHttp();
            const request = this.rbacBuilder.getRequestFromContext(context);
            if(request && !request?.options?.skipValidation){
                return this.validate(
                    request,
                    { context, request: http.getRequest(), response: http.getResponse() }
                );
            }
            return true;
        }

        validate(request: IRbacValidateRequest, context: IRbacValidateContext): boolean|Promise<boolean>|Observable<boolean> {
            return this.validateRequest(request, []);
        }

        validateRequest(request: IRbacValidateRequest, permissions: string[]): boolean {
            return this.rbac.validate(request, permissions);
        }
    }
    return mixin(MixinRbacGuard) as any;
}