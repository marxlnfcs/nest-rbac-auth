import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import {createTestModule, TestController} from "./test.module";

describe('Testing Library', () => {
  let app: INestApplication;
  let controller: TestController;

  // resolve test module
  beforeAll(async () => {
    const module: TestingModule = await createTestModule();

    app = module.createNestApplication();
    await app.init();
  });

  // inject controller
  describe('Inject Repositories', () => {
    it('should return the TestRepository instance', async () => {
      controller = await app.get(TestController);
      expect(controller).toBeTruthy();
    });
  });

  // close test module
  afterAll(async () => {
    //await deleteCollections();
    await app?.close();
  });

});