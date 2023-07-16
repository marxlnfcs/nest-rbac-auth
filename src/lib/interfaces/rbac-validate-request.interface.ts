import {IRbacVerbs} from "../enum/rbac-verb.enum";
import {ExecutionContext} from "@nestjs/common";
import {Request, Response} from "express";
import {IRbacRequiresOptions} from "./rbac-requires-options.interface";

export type IRbacValidateRequestOptions<Metadata extends object = any> = IRbacRequiresOptions<Metadata>;
export interface IRbacValidateRequest<Metadata extends object = any> {
    group: string;
    resource: string;
    resourceName?: string;
    verbs: IRbacVerbs;
    options: IRbacValidateRequestOptions<Metadata>;
}

export interface IRbacValidateContext {
    context: ExecutionContext;
    request: Request;
    response: Response;
}