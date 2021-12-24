import { RatingOption } from '../ratings';

export interface SetRating {
    readonly workId: string;
    readonly oldApprovalRating: RatingOption;
}
