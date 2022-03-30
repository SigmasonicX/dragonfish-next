import { browser } from '$app/env';
import { writable, get } from 'svelte/store';
import type { Account, Profile } from '$lib/models/accounts';
import type { LoginForm, ProfileForm, RegisterForm } from '$lib/models/accounts/forms';
import * as auth from '$lib/services/auth.service';
import * as lodash from 'lodash';

//#region ---SESSION---

interface SessionState {
    token: string;
    account: Account;
    profiles: Profile[];
    currProfile: Profile;
}

const defaultSessionState: SessionState = {
    token: null,
    account: null,
    profiles: [],
    currProfile: null,
};

const initialSessionState: SessionState = browser
    ? JSON.parse(window.localStorage.getItem('session')) ?? defaultSessionState
    : defaultSessionState;
export const session = writable<SessionState>(initialSessionState);

session.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('session', JSON.stringify(value));
    }
});

//#endregion

//#region ---SESSION HELPERS---

export async function login(payload: LoginForm): Promise<void> {
    return auth.login(payload).then((loginPackage) => {
        session.update((state) => ({
            ...state,
            account: loginPackage.account,
            token: loginPackage.token,
            profiles: loginPackage.account.pseudonyms,
        }));
    });
}

export async function register(payload: RegisterForm): Promise<void> {
    return auth.register(payload).then((loginPackage) => {
        session.update((state) => ({
            ...state,
            account: loginPackage.account,
            token: loginPackage.token,
            profiles: loginPackage.account.pseudonyms,
        }));
    });
}

export async function logout(): Promise<void> {
    return auth
        .logout()
        .then(() => {
            session.update(() => ({
                account: null,
                token: null,
                profiles: null,
                currProfile: null,
            }));
        })
        .catch((err) => {
            console.log(err);
            session.update(() => ({
                account: null,
                token: null,
                profiles: null,
                currProfile: null,
            }));
        });
}

export async function createProfile(formInfo: ProfileForm): Promise<void> {
    return auth.addProfile(formInfo).then((res) => {
        session.update((state) => ({
            ...state,
            profiles: lodash.unionBy(state.profiles, [res], '_id'),
        }));
    });
}

export function setCurrentProfile(profile: Profile): void {
    session.update((state) => ({
        ...state,
        currProfile: profile,
    }));
}

//#endregion

//#region ---GETTERS---

export const isLoggedIn = (): boolean => !!get(session).token;
export const token = (): string => get(session).token;

//#endregion

//#region ---TOKEN REFRESH---

interface RefreshState {
    isRefreshing: boolean;
    refreshCall;
}

const refresh = writable<RefreshState>({ isRefreshing: false, refreshCall: null });

export async function refreshToken(): Promise<unknown> {
    if (get(refresh).isRefreshing) {
        return get(refresh).refreshCall;
    }

    refresh.update((state) => ({
        ...state,
        isRefreshing: true,
    }));

    const refreshCall = auth.refreshToken().then((token) => {
        refresh.update((state) => ({
            ...state,
            isRefreshing: false,
            refreshCall: undefined,
        }));
        session.update((state) => ({
            ...state,
            token,
        }));
        return Promise.resolve(true);
    });
    refresh.update((state) => ({
        ...state,
        refreshCall,
    }));
    return refreshCall;
}

//#endregion
