import {Test, TestingModule} from "@nestjs/testing";
import {GetRbacGroup, RbacGroup} from "../src/lib/decorators/rbac-group.decorator";
import {GetRbacResource, RbacResource} from "../src/lib/decorators/rbac-resource.decorator";
import {
  GetRbacRequest,
  GetRbacRequiresOptions,
  GetRbacVerbs,
  RbacRequiresDelete,
  RbacRequiresGet,
  RbacRequiresList,
  RbacRequiresPatch,
  RbacRequiresUpdate
} from "../src/lib/decorators/rbac-requires.decorator";
import {Controller, Delete, Get, Injectable, Patch, Post, Put, UseGuards} from "@nestjs/common";
import {RbacModule} from "../src/lib/rbac.module";
import {RbacGuard} from "../src/lib/guards/rbac.guard";
import {Observable} from "rxjs";
import {IRbacResource} from "../src/lib/interfaces/rbac-resource.interface";
import {IRbacVerbs} from "../src/lib/enum/rbac-verb.enum";
import {IRbacValidateRequest} from "../src/lib/interfaces/rbac-validate-request.interface";
import {IRbacGroup} from "../src/lib/interfaces/rbac-group.interface";
import {IRbacRequiresOptions, RbacService} from "../src";

export function createTestModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      RbacModule.forRoot()
    ],
    controllers: [
      TestController
    ],
    providers: [
      TestGuard,
    ]
  }).compile();
}

@Injectable()
export class TestGuard extends RbacGuard() {
  constructor(
      private rbacService: RbacService,
  ){ super(); }

  validate(request: IRbacValidateRequest): boolean | Promise<boolean> | Observable<boolean> {
    const bindings = [
      this.rbacService.createBinding({
        verbs: ['*']
      }),
      this.rbacService.createBinding({
        verbs: ['-UPDATE', '-DELETE']
      })
    ];
    return this.validateRequest(request, bindings);
  }
}

@UseGuards(TestGuard)
@RbacGroup('Testing')
@RbacResource('Resource')
@Controller('/')
export class TestController {

  @RbacRequiresList()
  @Get()
  list(
      @GetRbacRequest() request: IRbacValidateRequest|null,
      @GetRbacGroup() group: IRbacGroup|null,
      @GetRbacResource() resource: IRbacResource|null,
      @GetRbacVerbs() verbs: IRbacVerbs,
      @GetRbacRequiresOptions() options: IRbacRequiresOptions,
  ){}

  @RbacRequiresGet()
  @Post()
  allowed(){}

  @RbacRequiresUpdate()
  @Put()
  denied(){}

  @RbacRequiresPatch({ skipValidation: true })
  @Patch()
  deniedButValidationSkipped() {}

  @RbacRequiresDelete()
  @Delete()
  deniedOfExcludingVerb() {}

}