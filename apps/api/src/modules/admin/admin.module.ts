import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { getJwtSecretKey, JWT_EXPIRATION } from '$shared/util';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import * as Services from './services';
import { ContentModule } from '$modules/content';

@Module({
    imports: [
        ContentModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'ApprovalQueue',
                useFactory: Schemas.setupApprovalQueueCollection,
            },
        ]),
        BullModule.registerQueue({
            name: 'approval-queue',
            limiter: {
                max: 1000,
                duration: 5000,
            },
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    exports: [],
    providers: [
        Stores.ApprovalQueueStore,
        Services.ApprovalQueueService,
        Services.ApprovalQueueConsumer,
    ],
    controllers: [],
})
export class AdminModule {}
