import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import {createTestModule, TestController} from "./test.module";
import {RbacService} from "../src/lib/services/rbac.service";
import * as request from 'supertest';

describe('Testing Library', () => {
  let app: INestApplication;
  let controller: TestController;
  let service: RbacService;

  // resolve test module
  beforeAll(async () => {
    const module: TestingModule = await createTestModule();

    app = module.createNestApplication();
    await app.init();
  });

  // inject controllers and services
  describe('Inject Controllers and Services', () => {
    it('should return the TestController instance', async () => {
      controller = await app.get(TestController);
      expect(controller).toBeTruthy();
    });
    it('should return the RbacService instance', async () => {
      service = await app.get(RbacService);
      expect(service).toBeTruthy();
    });
  });

  // get rbac groups
  describe('Get RBAC groups', () => {
    it('should return a list of RBAC groups', async () => {
      const groups = service.getGroups();
      expect(groups).toBeTruthy();
    });
  });

  // check rbac guard
  describe('Check rbac guard', () => {
    it('calling "GET /" should return status code 200', async () => {
      await request(app.getHttpServer()).get('/').expect(200);
    });
    it('calling "POST /" should return status code 200', async () => {
      await request(app.getHttpServer()).post('/').expect(201);
    });
    it('calling "PATCH /" should return status code 200', async () => {
      await request(app.getHttpServer()).patch('/').expect(200);
    });
    it('calling "PUT /" should return status code 403', async () => {
      await request(app.getHttpServer()).put('/').expect(403);
    });
    it('calling "DELETE /" should return status code 403', async () => {
      await request(app.getHttpServer()).delete('/').expect(403);
    });
  });

  // close test module
  afterAll(async () => {
    //await deleteCollections();
    await app?.close();
  });

});