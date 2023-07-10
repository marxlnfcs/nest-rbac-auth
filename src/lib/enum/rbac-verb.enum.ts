export type IRbacVerbOrString = RbacVerb|string;
export type IRbacVerbs = IRbacVerbOrString[];
export type IRbacVerbOrList = IRbacVerbOrString|IRbacVerbs;
export enum RbacVerb {
    LIST = 'LIST',
    GET = 'GET',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    DELETECOLLECTION = 'DELETECOLLECTION',
}