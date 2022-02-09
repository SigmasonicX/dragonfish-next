import type { Profile } from "$lib/models/accounts";
import type { Content, ContentFilter, SearchKind, SearchMatch } from "$lib/models/content";
import type { PaginateResult } from "$lib/models/util";
import { baseUrl } from "$lib/util";
import type { Observable } from "rxjs";
import { http } from "./http";
import { pipeData } from "./pipe-data";


/**
 * Fetches search results given query for the specified kids
 *
 * @param query The user's query
 * @param kind The kind of content that searching for
 * @param author (Optional) The author of content that searching for
 * @param categoryKey (Optional) The category key of content that searching for
 * @param genreSearchMatch When searching genre, how the genres should match
 * @param genreKeys (Optional) The genre keys of content that searching for
 * @param tagSearchMatch When searching tags, how the tags should match
 * @param tagIds (Optional) The fandom tags that searching for in content
 * @param includeChildTags When searching tags, if child tags should be searched too
 * @param pageNum The current results page
 * @param contentFilter The mature/explicit/etc. content filter to apply
 */
export function findRelatedContent(
    query: string,
    kind: SearchKind,
    author: string | null,
    categoryKey: string | null,
    genreSearchMatch: SearchMatch,
    genreKeys: string[] | null,
    tagSearchMatch: SearchMatch,
    tagIds: string[] | null,
    includeChildTags: boolean,
    pageNum: number,
    contentFilter: ContentFilter,
): Observable<PaginateResult<Content>> {
    return pipeData(
        http.get<PaginateResult<Content>>(
            `${baseUrl}/search/find-related-content?` +
                `query=${query}&kind=${kind}&author=${author}&categoryKey=${categoryKey}` +
                `&genreSearchMatch=${genreSearchMatch}&genreKeys=${genreKeys}` +
                `&tagSearchMatch=${tagSearchMatch}&tagIds=${tagIds}&includeChildTags=${includeChildTags}` +
                `&pageNum=${pageNum}&filter=${contentFilter}`,
            { observe: 'response', withCredentials: true },
        ),
    );
}

export function searchUsers(query: string, pageNum: number): Observable<PaginateResult<Profile>> {
    return pipeData(
        http.get<PaginateResult<Profile>>(
            `${baseUrl}/search/get-user-results?query=${query}&pageNum=${pageNum}`,
            { observe: 'response', withCredentials: true },
        ),
    );
}
