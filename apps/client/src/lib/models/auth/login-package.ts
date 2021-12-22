import type { FrontendAccount } from '@dragonfish/models';

export interface LoginPackage {
    account: FrontendAccount;
    token: string;
}
