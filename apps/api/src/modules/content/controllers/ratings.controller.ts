import { Controller, Query, Patch, UseGuards } from '@nestjs/common';
import { RatingsStore } from '../db/stores';
import { RolesGuard } from '$shared/guards';
import { Roles } from '$shared/models/accounts';
import { User, Identity, JwtPayload } from '$shared/auth';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratings: RatingsStore) {}

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Patch('add-like')
    async addLike(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return this.ratings.addLike(user, contentId);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Patch('add-dislike')
    async addDislike(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return this.ratings.addDislike(user, contentId);
    }

    @UseGuards(RolesGuard)
    @Identity(Roles.User)
    @Patch('set-no-vote')
    async setNoVote(@User() user: JwtPayload, @Query('contentId') contentId: string) {
        return this.ratings.setNoVote(user, contentId);
    }
}
