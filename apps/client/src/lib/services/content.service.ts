import { http } from './http';
import type { Content, ContentFilter, ContentKind } from '$lib/models/content';
import type { PaginateResult, PubContent } from '$lib/models/util';
import { baseUrl } from '$lib/util';
import type { AxiosResponse } from 'axios';
import type { FormType } from '$lib/models/content/works/forms';

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

export async function fetchOne(contentId: string, profileId?: string): Promise<PubContent> {
    const route = profileId
        ? `${baseUrl}/content/fetch-one?pseudId=${profileId}&contentId=${contentId}`
        : `${baseUrl}/content/fetch-one?contentId=${contentId}`;

    return http.get<PubContent>(route).then((res) => {
        return res.data;
    });
}

export async function createOne(
    profileId: string,
    kind: ContentKind,
    formInfo: FormType,
): Promise<AxiosResponse<Content>> {
    return http.put<Content>(
        `${baseUrl}/content/create-one?pseudId=${profileId}&kind=${kind}`,
        formInfo,
    );
}

//#endregion
