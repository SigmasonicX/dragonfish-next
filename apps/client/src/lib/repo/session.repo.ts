import { createState, select, Store, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import type { Profile, Account } from '$lib/models/accounts';
import type { LoginForm, ProfileForm, RegisterForm } from '$lib/models/accounts/forms';
import type { LoginPackage } from '$lib/models/accounts';
import { Observable, tap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { auth } from '../services';
import {
    addEntities,
    deleteAllEntities,
    selectActiveEntity,
    selectAll,
    setActiveId,
    setEntities,
    withActiveId,
    withEntities,
} from '@ngneat/elf-entities';

//#region ---STORE METADATA---

interface SessionProps {
    token: string;
    currentAccount: Account;
    error: string;
}

const { state, config } = createState(
    withProps<SessionProps>({ token: null, currentAccount: null, error: null }),
    withEntities<Profile, '_id'>({ idKey: '_id' }),
    withActiveId(),
);

const store = new Store({ state, name: 'session', config });
persistState(store, { key: 'session', storage: localStorageStrategy });

//#endregion

//#region ---SESSION---

export const state$ = store.pipe(select((state) => state));
export const token$ = store.pipe(select((state) => state.token));
export const isLoggedIn$ = store.pipe(select((state) => !!state.token));
export const currAccount$ = store.pipe(select((state) => state.currentAccount));

/**
 * Logs a user in.
 * @param payload
 */
export function login(payload: LoginForm): Observable<void> {
    return auth.login(payload).pipe(
        tap((user: LoginPackage) => {
            store.update((state) => ({
                ...state,
                token: user.token,
                currentAccount: user.account,
            }));
            setAllProfiles(user.account.pseudonyms);
        }),
        map(() => {
            return;
        }),
        catchError((err) => {
            //this.alerts.error(err.error.message);
            return throwError(err);
        }),
    );
}

/**
 * Registers a new user.
 * @param payload
 */
export function register(payload: RegisterForm): Observable<void> {
    return auth.register(payload).pipe(
        tap((user: LoginPackage) => {
            store.update((state) => ({
                ...state,
                token: user.token,
                currentAccount: user.account,
            }));
            setAllProfiles(user.account.pseudonyms);
        }),
        map(() => {
            return;
        }),
        catchError((err) => {
            //this.alerts.error(err.error.message);
            return throwError(err);
        }),
    );
}

/**
 * Logs a user out.
 */
export function logout(): Observable<void> {
    return auth.logout().pipe(
        tap(() => {
            store.update(
                (state) => ({
                    ...state,
                    token: null,
                    currentAccount: null,
                }),
                setActiveId(null),
                deleteAllEntities(),
            );
            //this.alerts.success(`See you next time!`);
        }),
        catchError((err) => {
            //this.alerts.error(err.error.message);
            return throwError(err);
        }),
    );
}

/**
 * Attempts to refresh a user's token. If the refresh token is expired, logs a user out.
 */
export function refreshToken(): Observable<string> {
    return auth.refreshToken().pipe(
        tap((result: string | null) => {
            if (result === null) {
                store.update(
                    (state) => ({
                        ...state,
                        token: null,
                        currentAccount: null,
                    }),
                    setActiveId(null),
                    deleteAllEntities(),
                );
                //this.alerts.info(`Your token has expired, and you've been logged out.`);
            } else {
                store.update((state) => ({
                    ...state,
                    token: result,
                }));
            }
        }),
        catchError((err) => {
            this.alerts.error(err.error.message);
            return throwError(err);
        }),
    );
}

/**
 * Creates a new profile associated with the current account
 * @param formData
 */
export function createProfile(formData: ProfileForm): Observable<Profile> {
    return auth.addProfile(formData).pipe(
        tap((result: Profile) => {
            const currAccount = store.getValue().currentAccount;
            currAccount.pseudonyms = [...currAccount.pseudonyms, result];
            store.update((state) => ({
                ...state,
                currentAccount: currAccount,
            }));
            addProfile(result);
        }),
        catchError((err) => {
            //this.alerts.error(err.error.message);
            return throwError(err);
        }),
    );
}

/**
 * Checks to see if the current profile is owned by the current session.
 * @param profileId
 */
export function checkPseudonym(profileId: string): boolean {
    if (currentAccount()) {
        return currentAccount().pseudonyms.some((elem) => elem._id === profileId);
    } else {
        return false;
    }
}

//#endregion

//#region ---PROFILES---

export const allProfiles$ = store.pipe(selectAll());
export const currentProfile$ = store.pipe(selectActiveEntity());

export function setAllProfiles(profiles: Profile[]): void {
    store.update(setEntities(profiles));
}

export function setActiveProfile(id: string): void {
    store.update(setActiveId(id));
}

export function deselect(): void {
    store.update(setActiveId(null));
}

export function addProfile(profile: Profile): void {
    store.update(addEntities(profile));
}

export function clearAll(): void {
    store.update(setActiveId(null), deleteAllEntities());
}

//#endregion

//#region ---GETTERS---

export const token = (): string => store.getValue().token;
export const isLoggedIn = (): boolean => !!store.getValue().token;
export const currentAccount = (): Account => store.getValue().currentAccount;

//#endregion
