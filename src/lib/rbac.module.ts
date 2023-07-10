import {DynamicModule, Module} from "@nestjs/common";
import {RbacService} from "./services/rbac.service";

@Module({})
export class RbacModule {
    static forRoot(): DynamicModule {
        return {
            module: RbacModule,
            providers: [
                RbacService,
            ],
            exports: [
                RbacService
            ],
        }
    }
}

