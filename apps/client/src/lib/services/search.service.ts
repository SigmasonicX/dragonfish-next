import type { Profile } from "$lib/models/accounts";
import type { Content, ContentFilter } from "$lib/models/content";
import type { PaginateResult } from "$lib/models/util";
import { baseUrl } from "$lib/util";
import type { Observable } from "rxjs";
import { http } from "./http";
import { pipeData } from "./pipe-data";


/**
 * Fetches search results given query for the specified kids
 *
 * @param query The user's query
 * @param kindKey The kind of content that searching for; key of kind type
 * @param author (Optional) The author of content that searching for
 * @param categoryKey (Optional) The category key of content that searching for
 * @param genreSearchMatchKey When searching genre, how the genres should match; key of match type
 * @param genreKeys (Optional) The genre keys of content that searching for
 * @param tagSearchMatchKey When searching tags, how the tags should match; key of match type
 * @param tagIds (Optional) The fandom tags that searching for in content
 * @param includeChildTags When searching tags, if child tags should be searched too
 * @param pageNum The current results page
 * @param contentFilter The mature/explicit/etc. content filter to apply
 */
export function findRelatedContent(
    query: string,
    kindKey: string,
    author: string | null,
    categoryKey: string | null,
    genreSearchMatchKey: string,
    genreKeys: string[] | null,
    tagSearchMatchKey: string,
    tagIds: string[] | null,
    includeChildTags: boolean,
    pageNum: number,
    contentFilter: ContentFilter,
): Observable<PaginateResult<Content>> {
    return pipeData(
        http.get<PaginateResult<Content>>(
            `${baseUrl}/search/find-related-content?` +
                `query=${query}&kind=${kindKey}&author=${author}&categoryKey=${categoryKey}` +
                `&genreSearchMatch=${genreSearchMatchKey}&genreKeys=${genreKeys}` +
                `&tagSearchMatch=${tagSearchMatchKey}&tagIds=${tagIds}&includeChildTags=${includeChildTags}` +
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
