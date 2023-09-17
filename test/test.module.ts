import {Test, TestingModule} from "@nestjs/testing";
import {
  GetRbacRequest,
  IRbacValidateRequest,
  RbacGuard,
  RbacModule,
  RbacRequiresDelete,
  RbacRequiresGet,
  RbacRequiresList,
  RbacRequiresUpdate,
  RbacSection
} from "../src";
import {Controller, Delete, Get, Injectable, Patch, Post, Put, UseGuards} from "@nestjs/common";
import {Observable} from "rxjs";

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
  validate(request: IRbacValidateRequest): boolean | Promise<boolean> | Observable<boolean> {
    return this.validateRequest(request, ['*', '!*.update', '!*.delete']);
  }
}

@UseGuards(TestGuard)
@RbacSection('foo.bar')
@Controller('/')
export class TestController {

  @RbacRequiresList()
  @Get()
  list(
      @GetRbacRequest() request: IRbacValidateRequest|null,
  ){}

  @RbacRequiresGet()
  @Post()
  allowed(){}

  @RbacRequiresUpdate()
  @Put()
  denied(){}

  @RbacRequiresUpdate({ skipValidation: true })
  @Patch()
  deniedButValidationSkipped() {}

  @RbacRequiresDelete()
  @Delete()
  deniedOfExcludingVerb() {}

}