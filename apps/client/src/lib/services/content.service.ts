import { http } from './http';
import type { ContentFilter, Content, ContentKind } from '$lib/models/content';
import type { PaginateResult, PubContent } from '$lib/models/util';
import { from, Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from '$lib/util';
import type { AxiosResponse } from 'axios';

//#region ---BROWSING---

export async function fetchFirstNew(
    contentFilter: ContentFilter,
): Promise<AxiosResponse<Content[]>> {
    return http.get<Content[]>(`${baseUrl}/browse/fetch-first-new?filter=${contentFilter}`);
}

export async function fetchAllNew(
    page: number,
    kinds: ContentKind[],
    filter: ContentFilter,
): Promise<AxiosResponse<PaginateResult<Content>>> {
    const kindFragment = kinds.map((k) => `&kind=${k}`).join('');
    const route = `${baseUrl}/browse/fetch-all-new?filter=${filter}&pageNum=${page}${kindFragment}`;

    return http.get<PaginateResult<Content>>(route);
}

//#endregion

//#region ---CONTENT---

export function fetchOne(contentId: string, profileId?: string): Observable<PubContent> {
    const route = profileId
        ? `${baseUrl}/content/fetch-one?pseudId=${profileId}&contentId=${contentId}`
        : `${baseUrl}/content/fetch-one?contentId=${contentId}`;

    return from(http.get<PubContent>(route)).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

//#endregion
