import { RatingsModel } from '../ratings';
import { ContentModel } from './content.model';
import { ContentLibrary } from '../content-library';

export interface PubContent {
    content: ContentModel;
    ratings: RatingsModel;
    libraryDoc: ContentLibrary;
}
