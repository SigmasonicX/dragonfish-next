import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import * as Services from './services';
import * as Controllers from './controllers';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Account',
                useFactory: Schemas.setupAccountCollection,
            },
            {
                name: 'Pseudonym',
                useFactory: Schemas.setupPseudonymCollection,
            },
        ]),
    ],
    exports: [Stores.AccountsStore],
    controllers: [Controllers.AuthController, Controllers.UserController],
    providers: [
        Stores.AccountsStore,
        Stores.PseudonymsStore,
        Services.AuthService,
        Services.UserService,
    ],
})
export class AccountsModule {}
