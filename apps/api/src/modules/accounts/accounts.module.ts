import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './db/schemas';

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
    exports: [],
    controllers: [],
    providers: [],
})
export class AccountsModule {}
