import {Test, TestingModule} from "@nestjs/testing";
import {RbacGroup} from "../src/lib/decorators/rbac-group.decorator";
import {RbacResource} from "../src/lib/decorators/rbac-resource.decorator";
import {RbacRequires, RbacRequiresGet, RbacRequiresUpdate} from "../src/lib/decorators/rbac-requires.decorator";
import {Controller} from "@nestjs/common";
import {RbacModule} from "../src/lib/rbac.module";

export function createTestModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      RbacModule.forRoot()
    ],
    controllers: [
      TestController
    ]
  }).compile();
}

@RbacGroup('Resources')
@RbacResource('Test')
@Controller()
export class TestController {

  @RbacRequires(['LIST', 'GET', 'UPDATE'])
  requiresList(){}

  @RbacGroup('Resources2')
  @RbacRequiresGet()
  requiresGet(){}

  @RbacResource('Test2')
  @RbacRequiresUpdate()
  requiresUpdate(){}

}