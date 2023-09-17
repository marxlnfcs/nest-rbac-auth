<p align="center" style="font-size: 40px;">NestJS RBAC Authorization</p>

<p align="center">Simple RBAC Implementation for NestJS that allowes you to define required permissions as glob pattern on controllers and routes and validate it with the builtin AuthGuard</p>
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

> **Information**
> If you want to use the old RBAC system, please use v0.1.4 because v1.X.X uses a new system with a dot notation (e.g.: foo.bar.*)

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
import { RbacSection, RbacRequires } from '@marxlnfcs/nest-rbac-auth';

@Controller('/users')
@RbacSection('access', 'Access Management')
@RbacSection('user', 'User')
export class UserController {

    @Get()
    // @RbacRequires(['list'], 'Can list users')
    // @RbacRequiresList('Can list users')
    @RbacRequires('list', 'Can list users')
    getUsers(){ ... }

    @Get('/:userId')
    // @RbacRequires(['get'], 'Can retrieve a user')
    // @RbacRequiresGet('Can retrieve a user')
    @RbacRequires('GET', 'Can retrieve a user')
    getUser(...){ ... }

    @Post('/')
    // @RbacRequires(['create'], 'Can create a user')
    // @RbacRequiresCreate('Can create a user')
    @RbacRequires('create', 'Can create a user')
    createUser(...){ ... }

    @Put('/:userId')
    // @RbacRequires(['update'], 'Can update a user')
    // @RbacRequiresUpdate('Can update a user')
    @RbacRequires('update', 'Can update a user')
    updateUser(...){ ... }

    @Delete('/:userId')
    // @RbacRequires(['delete'], 'Can delete a user')
    // @RbacRequiresDelete('Can delete a user')
    @RbacRequires('delete', 'Can delete a user')
    deleteUser(...){ ... }

    @Post('/action')
    // @RbacRequires(['custom'], 'Can do <custom> action')
    @RbacRequires('custom', 'Can do <custom> action')
    customAction(...){ ... }
    
}

@Controller('/groups')
@RbacSection('access', 'Access Management')
@RbacSection('group', 'Group')
export class GroupController {
    ...
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
        return this.validateRequest(request, ['*', '!*.create', '!*.update']);
    }
}
```

### Skip validation for certain routes
```typescript
import { RbacSection, RbacRequiresList } from '@marxlnfcs/nest-rbac-auth';

@Controller('/users')
@RbacSection('access', 'Access Management')
@RbacSection('user', 'User')
export class UserController {

    @Get()
    @RbacRequiresList({ skipValidation: true })
    getUsers(){ ... }

}
```