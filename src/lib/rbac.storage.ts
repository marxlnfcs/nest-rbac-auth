/** @internal */
const rbacControllers: Object[] = [];

/** @internal */
export function addRbacController<T>(target: T): T {
    if(!rbacControllers.includes(target)){
        rbacControllers.push(target);
    }
    return target;
}

/** @internal */
export function getRbacControllers(): any[] {
    return rbacControllers;
}