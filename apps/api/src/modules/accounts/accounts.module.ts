import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { getJwtSecretKey, JWT_EXPIRATION } from '$shared/util';
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
            {
                name: 'InviteCodes',
                useFactory: Schemas.setupInviteCodesCollection,
            },
        ]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
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
