import http from '$lib/services/http';
import type { Profile } from '$lib/models/accounts';
import type { ChangeScreenName, ChangeBio, ChangeTagline } from '$lib/models/accounts/forms';
import type { Observable } from 'rxjs';

export function getProfile(profileId: string): Observable<Profile> {
    return http.handleRequest(
        http.get<Profile>(`${this.baseUrl}/user/get-profile?pseudId=${profileId}`, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

export function changeScreenName(
    profileId: string,
    formInfo: ChangeScreenName,
): Observable<Profile> {
    return http.handleRequest(
        http.patch<Profile>(
            `${this.baseUrl}/user/change-screen-name?pseudId=${profileId}`,
            formInfo,
            {
                observe: 'response',
                withCredentials: true,
            },
        ),
    );
}

export function changeBio(profileId: string, formInfo: ChangeBio): Observable<Profile> {
    return http.handleRequest(
        http.patch<Profile>(`${this.baseUrl}/user/change-bio?pseudId=${profileId}`, formInfo, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

export function changeTagline(profileId: string, formInfo: ChangeTagline): Observable<Profile> {
    return http.handleRequest(
        http.patch<Profile>(`${this.baseUrl}/user/change-tagline?pseudId=${profileId}`, formInfo, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}
