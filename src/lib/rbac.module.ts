import {DynamicModule, Module, OnApplicationBootstrap} from "@nestjs/common";

@Module({})
export class RbacModule implements OnApplicationBootstrap {
    static forRoot(): DynamicModule {
        return {
            module: RbacModule,
            providers: [

            ]
        }
    }

    onApplicationBootstrap() {
        console.log('hi');
    }
}