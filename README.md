<p align="center" style="font-size: 40px;">NestJS RBAC Authorization</p>

<p align="center">Simple RBAC Implementation for NestJS that allowes you to define required VERBS on controllers and routes and validate it with the builtin AuthGuard</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-rbac-auth" target="_blank"><img src="https://img.shields.io/npm/v/@marxlnfcs/nest-rbac-auth.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-rbac-auth" target="_blank"><img src="https://img.shields.io/npm/l/@marxlnfcs/nest-rbac-auth.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-rbac-auth" target="_blank"><img src="https://img.shields.io/npm/dm/@marxlnfcs/nest-rbac-auth.svg" alt="NPM Downloads" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/nest-rbac-auth" target="_blank"><img src="https://img.shields.io/bundlephobia/min/@marxlnfcs/nest-rbac-auth?label=size" alt="Package Size" /></a>
</p>

> **Warning**
> This library is for experimentation and may contain some bugs that I will remove from time to time.
> With this library I'm learning how dependency injection works and how to build such libraries according to "best practice".
>
> So please use this library with caution.

## Installation
```
npm i @marxlnfcs/nest-rbac-auth
```

## Usage
### Import Module
```typescript
import { RbacModule } from '@marxlnfcs/nest-rbac-auth';

@Module({
    imports: [
        RbacModule.forRoot()
    ]
})
export class AppModule {}
```

### Controller
```typescript
import { RbacGroup, RbacResource, RbacRequires, RbacRequires } from '@marxlnfcs/nest-rbac-auth';

@Controller('/users')
@RbacGroup('AccessManagement')
@RbacResource('User')
export class UserController {

    @Get()
    // @RbacRequires(['LIST'])
    // @RbacRequiresList()
    @RbacRequires('LIST')
    getUsers(){ ... }

    @Get('/:userId')
    // @RbacRequires(['GET'])
    // @RbacRequiresGet()
    @RbacRequires('GET')
    getUser(...){ ... }

    @Post('/')
    // @RbacRequires(['CREATE'])
    // @RbacRequiresCreate()
    @RbacRequires('CREATE')
    createUser(...){ ... }

    @Put('/:userId')
    // @RbacRequires(['UPDATE'])
    // @RbacRequiresUpdate()
    @RbacRequires('PUT')
    updateUser(...){ ... }

    @Patch('/:userId')
    // @RbacRequires(['PATCH'])
    // @RbacRequiresPatch()
    @RbacRequires('PATCH')
    updateUserPartially(...){ ... }

    @Delete('/:userId')
    // @RbacRequires(['DELETE'])
    // @RbacRequiresDelete()
    @RbacRequires('DELETE')
    deleteUser(...){ ... }

    @Delete('/')
    // @RbacRequires(['DELETECOLLECTION'])
    // @RbacRequiresDeleteCollection()
    @RbacRequires('DELETECOLLECTION')
    deleteUserCollection(...){ ... }
    
}

@Controller('/groups')
@RbacGroup('AccessManagement')
@RbacResource('Groups')
export class GroupController {
    ...
}
```

### Retrieve Groups, Resources and Verbs of the current route
```typescript
import { RbacGroup, RbacResource, RbacRequires, RbacRequires, GetRbacGroup, GetRbacResource, GetRbacVerbs, IRbacGroup, IRbacResource, IRbacVerbs, IRbacRequiresOptions } from '@marxlnfcs/nest-rbac-auth';

@Controller('/users')
@RbacGroup('AccessManagement')
@RbacResource('User')
export class UserController {

    @Get()
    @RbacRequires('LIST')
    getUsers(
        @GetRbacGroup() group: IRbacGroup,
        @GetRbacResource() resource: IRbacResource,
        @GetRbacVerbs() verbs: IRbacVerbs,
        @GetRbacRequiresOptions() options: IRbacRequiresOptions,
    ){ ... }

}
```

### Validate Bindings / Permissions with the BuildIn AuthGuard
```typescript
import { RbacService, RbacGuard, IRbacValidateRequest } from '@marxlnfcs/nest-rbac-auth';

@Injectable()
export class RoleGuard extends RbacGuard() {
    constructor(
        private rbacService: RbacService,
    ){}
    
    validate(request: IRbacValidateRequest): boolean | Promise<boolean> | Observable<boolean> {
        
        // create test binding
        const binding = this.rbacService.createBinding({
            verbs: ['LIST', 'GET']
        })
        
        // validate binding with request
        return this.validateRequest(request, [binding]);

        /**
         * OR:
         * if(!this.validateRequest(request, [binding])){
         *  throw new ForbiddenException('No permissions');
         * }
         */

    }
}
```

### Skip validation for certain routes
```typescript
import { RbacGroup, RbacResource, RbacRequiresList } from '@marxlnfcs/nest-rbac-auth';

@Controller('/users')
@RbacGroup('AccessManagement')
@RbacResource('User')
export class UserController {

    @Get()
    @RbacRequiresList({ skipValidation: true })
    // @RbacRequires('LIST', { skipValidation: true, meta: { ... } )
    getUsers(){ ... }

}
```

### Create binding
```typescript
import { RbacService } from '@marxlnfcs/nest-rbac-auth';

@Injectable()
export class AppService {
    constructor(
        private rbacService: RbacService,
    ){}

    createBindings(){
        
        // create basic binding
        this.rbacService.createBinding({
            groups: ['AccessManagement'],
            resources: ['Users', 'Groups'],
            verbs: ['*']
        });

        // create wildcard binding
        this.rbacService.createBinding({
            groups: ['AccessManagement'], // ['*'] does also work
            resources: ['*'],
            verbs: ['*']
        });

        // Exclude resources, groups or verbs
        this.rbacService.createBinding({
            groups: ['*', '-AccessManagement'], // ['*'] does also work
            resources: ['*', '-Users'],
            verbs: ['*', '-CREATE']
        });
        
    }
}
```