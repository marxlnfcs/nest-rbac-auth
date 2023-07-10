import {Test, TestingModule} from "@nestjs/testing";
import {GetRbacGroup, RbacGroup} from "../src/lib/decorators/rbac-group.decorator";
import {GetRbacResource, RbacResource} from "../src/lib/decorators/rbac-resource.decorator";
import {
  GetRbacVerbs,
  RbacRequiresCreate,
  RbacRequiresGet,
  RbacRequiresList
} from "../src/lib/decorators/rbac-requires.decorator";
import {Controller, Get, Injectable, Post, Put, UseGuards} from "@nestjs/common";
import {RbacModule} from "../src/lib/rbac.module";
import {RbacGuard} from "../src/lib/guards/rbac.guard";
import {Observable} from "rxjs";
import {IRbacResource} from "../src/lib/interfaces/rbac-resource.interface";
import {IRbacVerbs} from "../src/lib/enum/rbac-verb.enum";
import {IRbacValidateRequest} from "../src/lib/interfaces/rbac-validate-request.interface";
import {IRbacGroup} from "../src/lib/interfaces/rbac-group.interface";
import {RbacService} from "../src";

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
    const binding = this.rbacService.createBinding({
      verbs: ['LIST', 'GET']
    })
    return this.validateRequest(request, [binding]);
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
      @GetRbacGroup() group: IRbacGroup|null,
      @GetRbacResource() resource: IRbacResource|null,
      @GetRbacVerbs() verbs: IRbacVerbs,
  ){}

  @RbacRequiresGet()
  @Post()
  allowed(){}

  @RbacRequiresCreate()
  @Put()
  denied(){}

}