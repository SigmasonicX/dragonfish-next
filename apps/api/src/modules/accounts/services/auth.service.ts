import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { argon2id, verify } from 'argon2';
import { nanoid } from 'nanoid';
import { JwtPayload, LoginPackage } from '$shared/auth';
import { DeviceInfo, REFRESH_EXPIRATION } from '$shared/util';
import { AccountsStore, PseudonymsStore } from '../db/stores';
import {
    Account,
    AccountForm,
    PseudonymForm,
    Pseudonym,
    FrontendAccount,
} from '@dragonfish/models';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);

    constructor(
        private readonly accountStore: AccountsStore,
        private readonly pseudStore: PseudonymsStore,
        private readonly jwtService: JwtService,
    ) {}

    //#region ---ACCOUNTS---

    public async validateAccount(email: string, password: string): Promise<Account | null> {
        const potentialAccount = await this.accountStore.fetchAccountByEmail(email);
        if (!potentialAccount) {
            throw new NotFoundException(
                `No user with those credentials found. Have you signed up?`,
            );
        }

        try {
            if (!(await verify(potentialAccount.password, password, { type: argon2id }))) {
                this.logger.warn(
                    `Someone attempted to log into Account ${potentialAccount._id} and failed!`,
                );
                return null;
            }

            return potentialAccount;
        } catch (err) {
            throw new InternalServerErrorException(
                `Something went wrong! Code: sunfish. Details: ${err}`,
            );
        }
    }

    public async login(
        user: Account,
        req,
        device: DeviceInfo,
        rememberMe: boolean,
    ): Promise<LoginPackage> {
        const payload = await AuthService.createPayload(user);
        if (rememberMe) {
            const userWithSession = await this.createSession(user._id, req, device);
            return await AuthService.buildLoginPackage(
                this.jwtService.sign(payload),
                await this.accountStore.createFrontendAccount(userWithSession),
            );
        } else {
            return await AuthService.buildLoginPackage(
                this.jwtService.sign(payload),
                await this.accountStore.createFrontendAccount(user),
            );
        }
    }

    public async register(req, device: DeviceInfo, formInfo: AccountForm): Promise<LoginPackage> {
        const validCode = await this.accountStore.findOneInviteCode(formInfo.inviteCode);

        if (validCode !== null) {
            const addedUser = await this.accountStore.createAccount(formInfo);
            await this.accountStore.useInviteCode(formInfo.inviteCode, addedUser._id);
            this.logger.log(`New user created with ID: ${addedUser._id}`);
            return await this.login(addedUser, req, device, false);
        } else {
            throw new UnauthorizedException(`You need a valid invite code to register!`);
        }
    }

    public async logout(req): Promise<void> {
        req._cookies = [
            {
                name: 'refreshToken',
                value: '',
                options: { httpOnly: true, expires: new Date(Date.now()) },
            },
        ];
    }

    public async refreshLogin(user: JwtPayload): Promise<string> {
        const validatedUser = await this.accountStore.fetchAccountById(user.sub);
        const newPayload = await AuthService.createPayload(validatedUser);

        return this.jwtService.sign(newPayload);
    }

    public async checkRefreshToken(accountId: string, sessionId: string): Promise<boolean> {
        const hashedSessionId = createHash('sha256').update(sessionId).digest('base64');
        return await this.accountStore.checkSession(accountId, hashedSessionId);
    }

    public async clearRefreshToken(userId: string, oldSessionId: string): Promise<void> {
        const hashedSessionId = createHash('sha256').update(oldSessionId).digest('base64');
        await this.accountStore.removeSession(userId, hashedSessionId);
    }

    //#endregion

    //#region ---PSEUDONYMS---

    public async createPseudonym(user: JwtPayload, formInfo: PseudonymForm): Promise<Pseudonym> {
        const thisAccount = await this.accountStore.fetchAccountById(user.sub);

        if (thisAccount === null || thisAccount === undefined) {
            throw new NotFoundException(`The account you're trying to edit could not be found.`);
        }

        const newPseud = await this.pseudStore.createPseud(user, formInfo);
        await this.accountStore.addPseudonym(thisAccount._id, newPseud._id);
        return newPseud;
    }

    //#endregion

    //#region ---PRIVATE---

    private static async createPayload(user: Account): Promise<JwtPayload> {
        return {
            roles: user.roles,
            sub: user._id,
        };
    }

    private static async buildLoginPackage(
        signedPayload: string,
        user: FrontendAccount,
    ): Promise<LoginPackage> {
        return {
            token: signedPayload,
            account: user,
        };
    }

    private async createSession(accountId: string, req, deviceInfo: DeviceInfo): Promise<Account> {
        const sessionId = nanoid();
        const expiration = new Date(Date.now() + REFRESH_EXPIRATION);
        req._cookies = [
            {
                name: 'refreshToken',
                value: sessionId,
                options: { httpOnly: true, expires: expiration },
            },
        ];
        return await this.accountStore.saveSession(accountId, sessionId, deviceInfo, expiration);
    }

    //#endregion
}
