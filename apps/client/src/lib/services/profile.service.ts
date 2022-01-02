import { http } from '$lib/services/http';
import type { Profile } from '$lib/models/accounts';
import type { ChangeScreenName, ChangeBio, ChangeTagline } from '$lib/models/accounts/forms';
import type { Observable } from 'rxjs';
import { baseUrl } from '$lib/util';
import { from, take } from 'rxjs';
import { map } from 'rxjs/operators';

export function getProfile(profileId: string): Observable<Profile> {
    return from(http.get<Profile>(`${baseUrl}/user/get-profile?pseudId=${profileId}`)).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

export function changeScreenName(
    profileId: string,
    formInfo: ChangeScreenName,
): Observable<Profile> {
    return from(
        http.patch<Profile>(`${baseUrl}/user/change-screen-name?pseudId=${profileId}`, formInfo),
    ).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

export function changeBio(profileId: string, formInfo: ChangeBio): Observable<Profile> {
    return from(
        http.patch<Profile>(`${baseUrl}/user/change-bio?pseudId=${profileId}`, formInfo),
    ).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

export function changeTagline(profileId: string, formInfo: ChangeTagline): Observable<Profile> {
    return from(
        http.patch<Profile>(`${baseUrl}/user/change-tagline?pseudId=${profileId}`, formInfo),
    ).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}
