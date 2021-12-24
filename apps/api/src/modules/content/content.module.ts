import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Content',
                useFactory: Schemas.setupContentCollection,
                discriminators: [
                    { name: 'BlogContent', schema: Schemas.BlogsContentSchema },
                    { name: 'PoetryContent', schema: Schemas.PoetryContentSchema },
                    { name: 'ProseContent', schema: Schemas.ProseContentSchema },
                ],
            },
            {
                name: 'Ratings',
                useFactory: Schemas.setupRatingsCollection,
            },
            {
                name: 'ReadingHistory',
                useFactory: Schemas.setupReadingHistoryCollection,
            },
            {
                name: 'Sections',
                useFactory: Schemas.setupSectionsCollection,
            },
            {
                name: 'Tags',
                useFactory: Schemas.setupTagsCollection,
            },
        ]),
    ],
    exports: [Stores.ContentStore, Stores.ContentGroupStore],
    controllers: [],
    providers: [
        Stores.ContentStore,
        Stores.ContentGroupStore,
        Stores.BlogsStore,
        Stores.ProseStore,
        Stores.PoetryStore,
        Stores.RatingsStore,
        Stores.ReadingHistoryStore,
        Stores.TagsStore,
        Stores.SectionsStore,
    ],
})
export class ContentModule {}
