import { Store, createState, withProps, select } from '@ngneat/elf';
import type { Profile } from '$lib/models/accounts';
import { profile } from '../services';
import { Observable, map, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

//#region ---STORE METADATA---

interface ProfileProps {
    currProfile: Profile;
}

const { state, config } = createState(withProps<ProfileProps>({ currProfile: null }));

const store = new Store({ state, name: 'profile', config });

//#endregion

//#region ---PROFILE---

export const profile$ = store.pipe(select((state) => state.currProfile));

export function setProfile(profileId: string): Observable<void> {
    return profile.getProfile(profileId).pipe(
        tap((result) => {
            store.update((state) => ({
                ...state,
                currProfile: result,
            }));
        }),
        map(() => {
            return;
        }),
        catchError((err) => {
            return throwError(err);
        }),
    );
}

//#endregion

//#region ---GETTERS---

export const screenName = (): string => store.getValue().currProfile.screenName;
export const userTag = (): string => store.getValue().currProfile.userTag;
export const profileId = (): string => store.getValue().currProfile._id;

//#endregion
