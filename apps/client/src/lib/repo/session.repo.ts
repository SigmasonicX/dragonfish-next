import { createState, select, Store, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import type { Login, AccountForm, Pseudonym, FrontendAccount } from '@dragonfish/models';
import type { LoginPackage } from '$lib/models/auth';
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
    currentAccount: FrontendAccount;
    error: string;
}

const { state, config } = createState(
    withProps<SessionProps>({ token: null, currentAccount: null, error: null }),
    withEntities<Pseudonym, '_id'>({ idKey: '_id' }),
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
export function login(payload: Login): Observable<void> {
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
export function register(payload: AccountForm): Observable<void> {
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

//#endregion

//#region ---PROFILES---

export const allProfiles$ = store.pipe(selectAll());
export const currentProfile$ = store.pipe(selectActiveEntity());

export function setAllProfiles(profiles: Pseudonym[]): void {
    store.update(setEntities(profiles));
}

export function setActiveProfile(id: string): void {
    store.update(setActiveId(id));
}

export function deselect(): void {
    store.update(setActiveId(null));
}

export function addProfile(profile: Pseudonym): void {
    store.update(addEntities(profile));
}

export function clearAll(): void {
    store.update(setActiveId(null), deleteAllEntities());
}

//#endregion

//#region ---GETTERS---

export const token = (): string => store.getValue().token;
export const isLoggedIn = (): boolean => !!store.getValue().token;

//#endregion
