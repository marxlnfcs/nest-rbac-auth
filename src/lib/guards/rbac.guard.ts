import {CanActivate, ExecutionContext, mixin, Type} from "@nestjs/common";
import {IRbacResource} from "../interfaces/rbac-resource.interface";
import {Observable} from "rxjs";
import {Request, Response} from 'express';
import {getRbac, RbacService} from "../services/rbac.service";
import {memoize} from "../utils/memoize.utils";
import {IRbacValidateRequest} from "../interfaces/rbac-validate-request.interface";
import {getRbacBuilder} from "../services/rbac-builder.service";
import {IRbacBinding} from "../interfaces/rbac-binding.interface";

export interface RbacValidationGuard {
    validate(request: IRbacValidateRequest, resource: IRbacResource): boolean|Promise<boolean>|Observable<boolean>;
    validateRequest(request: IRbacValidateRequest, bindings: IRbacBinding[]): boolean;
    getContext(): ExecutionContext;
    getRequest(): Request;
    getResponse(): Response;
}

export const RbacGuard: () => Type<RbacValidationGuard> = memoize(createRbacGuard);

function createRbacGuard(): Type<RbacValidationGuard> {
    class MixinRbacGuard implements CanActivate {
        private rbac = getRbac();
        private rbacBuilder = getRbacBuilder();
        private context: ExecutionContext;
        private resource: IRbacResource|null;

        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            this.context = context;
            this.resource = this.rbacBuilder.getResourceFromContext(context);

            if(this.resource){
                return this.validate(
                    {
                        group: this.resource.group,
                        resource: this.resource.name,
                        verbs: this.rbacBuilder.getVerbsFromContext(context)
                    },
                    this.resource
                );
            }
            return true;
        }

        getResource(): IRbacResource { return this.resource || null; };
        getContext(): ExecutionContext { return this.context }
        getRequest(): Request { return this.context?.switchToHttp().getRequest() }
        getResponse(): Response { return this.context?.switchToHttp().getResponse() }

        validate(request: IRbacValidateRequest, resource: IRbacResource): boolean|Promise<boolean>|Observable<boolean> {
            return false;
        }

        validateRequest(request: IRbacValidateRequest, bindings: IRbacBinding[]): boolean {
            return this.rbac.validate(request, bindings);
        }
    }
    return mixin(MixinRbacGuard) as any;
}