import {
    Controller,
    UseGuards,
    Patch,
    Get,
    Post,
    Body,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IdentityGuard } from '$shared/guards';
import { User, JwtPayload, Identity } from '$shared/auth';
import { UserService } from '../services';
import { ChangeBio, ChangeScreenName, ChangeTagline, Roles } from '$shared/models/accounts';

@Controller('user')
export class UserController {
    constructor(private readonly user: UserService) {}

    @Get('get-profile')
    async getProfile(@Query('pseudId') pseudId: string) {
        return await this.user.getOneUser(pseudId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('change-screen-name')
    async changeScreenName(@Query('pseudId') pseudId: string, @Body() formInfo: ChangeScreenName) {
        return await this.user.changeScreenName(pseudId, formInfo);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('change-bio')
    async updateBio(@Query('pseudId') pseudId: string, @Body() newBio: ChangeBio) {
        return await this.user.updateBio(pseudId, newBio);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() avatarImage: any, @Query('pseudId') pseudId: string) {
        /*const avatarUrl = await this.images.upload(avatarImage, pseudId, 'avatars');
        const avatar = `${process.env.IMAGES_HOSTNAME}/avatars/${avatarUrl.substr(
            avatarUrl.lastIndexOf('/') + 1,
        )}`;
        return await this.user.updateAvatar(pseudId, avatar);*/
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @UseInterceptors(FileInterceptor('coverPic'))
    @Post('upload-cover')
    async uploadCover(@UploadedFile() coverImage: any, @Query('pseudId') pseudId: string) {
        /*const avatarUrl = await this.images.upload(coverImage, pseudId, 'cover-pics');
        const avatar = `${process.env.IMAGES_HOSTNAME}/cover-pics/${avatarUrl.substr(
            avatarUrl.lastIndexOf('/') + 1,
        )}`;
        return await this.user.updateCoverPic(pseudId, avatar);*/
    }

    @UseGuards(IdentityGuard)
    @Identity(
        Roles.Admin,
        Roles.Moderator,
        Roles.ChatModerator,
        Roles.Maintainer,
        Roles.Contributor,
        Roles.WorkApprover,
        Roles.VIP,
    )
    @Patch('change-tagline')
    async updateTagline(
        @User() user: JwtPayload,
        @Query('pseudId') pseudId: string,
        @Body() tagline: ChangeTagline,
    ) {
        return await this.user.updateTagline(user, pseudId, tagline);
    }
}
