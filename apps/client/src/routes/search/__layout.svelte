<script lang="ts">
    import { createForm } from 'felte';
    import { page } from '$app/stores';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import PageNav from '$lib/components/nav/PageNav.svelte';
    import { TeamLine } from 'svelte-remixicon';
    import { Content, SearchKind, SearchMatch } from '$lib/models/content';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import { Genres, TagKind, WorkKind } from '$lib/models/content/works';
    import { search, tags } from '$lib/services';
    import { app } from '$lib/repo/app.repo';
    import type { PaginateResult } from '$lib/models/util';
    import type { Profile } from '$lib/models/accounts';
    import BlogCard from '$lib/components/ui/content/BlogCard.svelte';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import Paginator from '$lib/components/ui/misc/Paginator.svelte';
    import Toggle from '$lib/components/forms/Toggle.svelte';
    import { goto } from '$app/navigation';
    import { searchKindDefaultKey } from '$lib/models/content/search-kind.enum';
    import { searchMatchDefaultKey } from '$lib/models/content/search-match.enum';
    import { onMount } from 'svelte';

    const searchKindOptions = Object.entries(SearchKind).map(([key, value]) => ({
        value: key,
        label: value,
    }))

    const anyOption = "Any"

    const categoryOptions: Array<any> = Object.entries(WorkKind).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1))
    categoryOptions.push({
        value: anyOption,
        label: anyOption,
    })

    const genreMatchOptions = Object.entries(SearchMatch).map(([key, value]) => ({
        value: key,
        label: value,
    }))
    const genreOptions = Object.entries(Genres).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1))

    const tagMatchOptions = Object.entries(SearchMatch).map(([key, value]) => ({
        value: key,
        label: value,
    }))

    let searchResultWorks: PaginateResult<Content>;
    let searchResultBlogs: PaginateResult<Content>;
    let searchResultUsers: PaginateResult<Profile>;

    var loading = false;

    const tagOptions = [];

    var queryValue: string = null
    var searchKindValue: any
    var showAdvancedOptions: boolean
    var authorValue: string
    var categoryValue: any
    var genreSearchMatchValue: any
    var genreValues: any[]
    var tagSearchMatchValue: any
    var tagValues: any[]
    var includeChildTagsValue: boolean
    var showIncludeChildTags: boolean
    var currPage: number = 1

    onMount(() => {
        tags.fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
            for (const tree of tagTrees) {
                tagOptions.push({ value: tree._id, label: tree.name, isParent: (tree.children.length > 0) })
                for (const child of tree.children) {
                    tagOptions.push({ value: child._id, label: tree.name + "  —  " + child.name, isParent: false})
                }
            }

            // This has to be after tag options or else tag options aren't placed in the form
            processQueryParams()
        })
    })

    function processQueryParams() {
        const searchParams = $page.url.searchParams
        var shouldSearch = false

        if (searchParams.has('query')) {
            queryValue = searchParams.get('query')
            shouldSearch = true
        }

        if (searchParams.has('author') || searchParams.has('category')
            || searchParams.has('genres') || searchParams.has('tags')) {
            showAdvancedOptions = true
            shouldSearch = true
        }

        const initialSearchKindKey: string = searchParams.has('kind') ?
            parseSearchKindKey(searchParams.get('kind')) :
            searchKindDefaultKey
        searchKindValue = createSearchKindMenuItem(initialSearchKindKey)

        authorValue = searchParams.has('author') ?
            searchParams.get('author') :
            null

        const initialCategoryKey: string = searchParams.has('category') ?
            parseCategoryKey(searchParams.get('category')) :
            anyOption
        categoryValue = createCategoryMenuItem(initialCategoryKey)

        const initialGenreSearchMatchKey: string = searchParams.has('genreSearchMatch') ?
            parseMatchKey(searchParams.get('genreSearchMatch')) :
            searchMatchDefaultKey
        genreSearchMatchValue = createMatchMenuItem(initialGenreSearchMatchKey)

        const initialGenreKeys: string[] = searchParams.has('genres') ?
            parseGenreKeys(searchParams.get('genres').split(',')) :
            null
        genreValues = createGenreMenuItems(initialGenreKeys)

        const initialTagSearchMatchKey: string = searchParams.has('tagSearchMatch') ?
            parseMatchKey(searchParams.get('tagSearchMatch')) :
            searchMatchDefaultKey
        tagSearchMatchValue = createMatchMenuItem(initialTagSearchMatchKey)

        const initialTagKeys: string[] = searchParams.has('tags') ?
            searchParams.get('tags').split(',') :
            null
        tagValues = createTagMenuItems(initialTagKeys)

        includeChildTagsValue = searchParams.get('includeChildTags') !== 'false'

        showIncludeChildTags = searchParams.has('includeChildTags')

        if (searchParams.has('page')) {
            currPage = +searchParams.get('page')
            shouldSearch = true
        }

        if (shouldSearch) {
            fetchData(
                queryValue,
                initialSearchKindKey,
                authorValue,
                initialCategoryKey,
                initialGenreSearchMatchKey,
                initialGenreKeys,
                initialTagSearchMatchKey,
                initialTagKeys,
                includeChildTagsValue,
                currPage
            )
        }
    }

    function setNewPage(pageNum: number) {
        currPage = pageNum;
    }

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            const query = values.query ?? null
            const searchKind = parseSearchKindKey(searchKindValue)
            const author = values.author ?? null
            const category = parseCategoryKey(categoryValue)
            const genreSearchMatch = parseMatchKey(genreSearchMatchValue)
            const genres = parseGenreKeys(genreValues)
            const tagSearchMatch = parseMatchKey(tagSearchMatchValue)
            const tags: string[] = tagValues ? tagValues.map((val) => {
                return val.value as string
            }) : null
            const includeChildTags = includeChildTagsValue
            const pageNum = currPage

            const newSearchParams = new URLSearchParams()
            if (query) {
                newSearchParams.set('query', query)
            }
            if (searchKind && SearchKind[searchKind] !== SearchKind.ProseAndPoetry) {
                newSearchParams.set('kind', searchKind)
            }
            if (searchKind !== SearchKind.User) {
                if (author) {
                    newSearchParams.set('author', author)
                }
                if (category && category !== anyOption) {
                    newSearchParams.set('category', category)
                }
                if (genres && genres.length > 0) {
                    if (genreSearchMatch && SearchMatch[genreSearchMatch] !== SearchMatch.All) {
                        newSearchParams.set('genreSearchMatch', genreSearchMatch)
                    }
                    newSearchParams.set('genres', genres.toString())
                }
                if (tags && tags.length > 0) {
                    if (tagSearchMatch && SearchMatch[tagSearchMatch] !== SearchMatch.All) {
                        newSearchParams.set('tagSearchMatch', tagSearchMatch)
                    }
                    newSearchParams.set('tags', tags.toString())
                    if (showIncludeChildTags) {
                        newSearchParams.set('includeChildTags', includeChildTags.toString())
                    }
                }
            }
            if (pageNum && pageNum > 0) {
                newSearchParams.set('page', pageNum.toString())
            }
            goto("/search?" + newSearchParams.toString())

            fetchData(
                query,
                searchKind,
                author,
                category,
                genreSearchMatch,
                genres,
                tagSearchMatch,
                tags,
                includeChildTags,
                pageNum
            )
        },
    });

    /**
     * Takes either a string key or an object of format (value, label) where value is a string key
     * @param kindKey
     * @returns The provided key as a string if it's valid, or "ProseAndPoetry" if it isn't
     */
    function parseSearchKindKey(kindKey: any): string {
        var kindString: string
        if (typeof kindKey === 'string') {
            kindString = kindKey
        } else {
            kindString = kindKey ? kindKey.value : null
        }
        const kind: SearchKind = SearchKind[kindString]
        return Object.values(SearchKind).indexOf(kind) >= 0 ? kindString : searchKindDefaultKey
    }

    /**
     * For use in the form menu
     * @param kindKey
     * @returns The provided key and its SearchKind value as an object of the form {value, label}
     */
    function createSearchKindMenuItem(kindKey: string) {
        return {value: kindKey, label: SearchKind[kindKey]}
    }

    /**
     * Takes either a string key or an object of format (value, label) where value is a string key
     * Categories are stored for works via their keys, so we want to return the key instead of the value
     * @param categoryKey
     * @returns The provided key as a string if it's valid, or "Any" if it isn't
     */
    function parseCategoryKey(categoryKey: any): string {
        var categoryString: string
        if (typeof categoryKey === 'string') {
            categoryString = categoryKey
        } else {
            categoryString = categoryKey ? categoryKey.value : anyOption
        }
        const category: WorkKind = WorkKind[categoryString]
        return Object.values(WorkKind).indexOf(category) >= 0 ? categoryString : anyOption
    }

    /**
     * For use in the form menu
     * @param categoryKey
     * @returns The provided key and its WorkKind value as an object of the form {value, label}
     */
    function createCategoryMenuItem(categoryKey: string) {
        return {value: categoryKey, label: WorkKind[categoryKey]}
    }

    /**
     * Takes either a string key or an object of format (value, label) where value is a string key
     * Matches are made using the key, so we want to return the key instead of the value
     * @param matchKey
     * @returns The provided key as a string if it's valid, or "All" if it isn't
     */
    function parseMatchKey(matchKey: any): string {
        var matchString: string
        if (typeof matchKey === 'string') {
            matchString = matchKey
        } else {
            matchString = matchKey ? matchKey.value : null
        }
        const match: SearchMatch = SearchMatch[matchString]
        return Object.values(SearchMatch).indexOf(match) >= 0 ? matchString : searchMatchDefaultKey
    }

    /**
     * For use in the form menu
     * @param matchKey
     * @returns The provided key and its SearchMatch value as an object of the form {value, label}
     */
    function createMatchMenuItem(matchKey: string) {
        return {value: matchKey, label: SearchMatch[matchKey]}
    }

    /**
     * Takes either an array of string keys
     * or an array of objects of format (value, label) where value is a string key
     * Genres are stored for works via their keys, so we want to return the key values instead of the labels
     * (i.e. ScienceFiction instead of Science Fiction)
     * @param genreKeys
     * @returns Array of all the valid keys provided, as a string array
     */
    function parseGenreKeys(genreKeys: any[]): string[] {
        const genreList: string[] = [];
        if (genreKeys) {
            for (const genreKey of genreKeys) {
                var genreString: string
                if (typeof genreKey === 'string') {
                    genreString = genreKey
                } else {
                    genreString = genreKey.value
                }
                if (Object.values(Genres).indexOf(Genres[genreString]) >= 0) {
                    genreList.push(genreString);
                }
            }
        }

        return genreList;
    }

    /**
     * For use in the form menu
     * @param genreKeys
     * @returns The provided keys and their Genre values as objects of the form {value, label}
     */
    function createGenreMenuItems(genreKeys: string[]) {
        if (genreKeys) {
            return genreKeys.map((value) => ({value: value, label: Genres[value]}))
        }
        return null
    }

    /**
     * For use in the form menu
     * @param tagKeys
     * @returns The tags for the provided keys as objects of the form {value, label, isParent}
     */
    function createTagMenuItems(tagKeys: string[]) {
        if (tagKeys) {
            const tagMenuItems: any[] = []
            for (const tag of tagKeys) {
                for (const tagOption of tagOptions) {
                    if (tag === tagOption.value) {
                        tagMenuItems.push(tagOption)
                    }
                }
            }
            if (tagMenuItems.length > 0) {
                return tagMenuItems
            }
        }
        return null
    }

    function setShowIncludeChildTags() {
        if (tagValues && tagSearchMatchValue.label !== SearchMatch.Exactly) {
            for (const tag of tagValues) {
                if (tag.isParent) {
                    showIncludeChildTags = true;
                    return;
                }
            }
        }
        showIncludeChildTags = false;
    }

    function clearResults() {
        searchResultWorks = null;
        searchResultBlogs = null;
        searchResultUsers = null;
    }

    function fetchData(
        query: string,
        searchKind: string,
        author: string | null,
        searchCategory: string | null,
        genreSearchMatch: string,
        genres: string[] | null,
        tagSearchMatch: string,
        tagIds: string[] | null,
        includeChildTags: boolean,
        pageNum: number
    ) {
        loading = true;
        clearResults();
        switch(SearchKind[searchKind]) {
            case SearchKind.Blog:
                search.findRelatedContent(
                    query,
                    searchKind,
                    author,
                    searchCategory,
                    genreSearchMatch,
                    genres,
                    tagSearchMatch,
                    tagIds,
                    includeChildTags,
                    pageNum,
                    $app.filter,
                ).subscribe((results) => {
                    searchResultBlogs = results;
                    loading = false;
                })
                break;
            case SearchKind.User:
                search.searchUsers(query, pageNum).subscribe((results) => {
                    searchResultUsers = results;
                    loading = false;
                });
                break;
            case SearchKind.Poetry:
            case SearchKind.ProseAndPoetry:
            case SearchKind.Prose:
            default:
                search.findRelatedContent(
                    query,
                    searchKind,
                    author,
                    searchCategory,
                    genreSearchMatch,
                    genres,
                    tagSearchMatch,
                    tagIds,
                    includeChildTags,
                    pageNum,
                    $app.filter,
                ).subscribe((results) => {
                    searchResultWorks = results;
                    loading = false;
                });
        }
    }
</script>

<!-- <div class="flex w-full h-screen"> -->
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Search</h3>
            <TeamLine />
        </svelte:fragment>

        <svelte:fragment slot="pages">
            <form use:form>
                <TextField
                    name="query"
                    type="text"
                    title="Query"
                    placeholder="Search..."
                    value={queryValue}
                    errorMessage={$errors.query}
                />
                <Button type="submit">
                    <span class="button-text">Search</span>
                </Button>

                <SelectMenu
                    items={searchKindOptions}
                    label="Search Kind"
                    value={searchKindValue}
                    on:select={(e) => {
                        $data.searchKind = e.detail
                        searchKindValue = e.detail
                    }}
                />
                {#if showAdvancedOptions}
                    <div on:click={() => showAdvancedOptions = false}>Hide Advanced</div>
                    {#if (searchKindValue && searchKindValue.label !== SearchKind.User)}
                        <TextField
                            name="author"
                            type="text"
                            title="Author"
                            placeholder="Search..."
                            value={authorValue}
                            errorMessage={$errors.author}
                        />
                        <SelectMenu
                            items={categoryOptions}
                            label="Category"
                            value={categoryValue}
                            on:select={(e) => {
                                $data.category = e.detail
                                categoryValue = e.detail
                            }}
                        />
                        <div>Genre(s)</div>
                        <SelectMenu
                            items={genreMatchOptions}
                            label="Genre Search Match"
                            value={genreSearchMatchValue}
                            on:select={(e) => {
                                $data.genreSearchMatch = e.detail
                                genreSearchMatchValue = e.detail
                            }}
                        />
                        <SelectMenu
                            items={genreOptions}
                            label="Genre Search"
                            isMulti={true}
                            value={genreValues}
                            on:select={(e) => {
                                $data.genres = e.detail
                                genreValues = e.detail
                            }}
                        />
                        <div>Fandom Tag(s)</div>
                        <SelectMenu
                            items={tagMatchOptions}
                            label="Tag Search Match"
                            value={tagSearchMatchValue}
                            on:select={(e) => {
                                $data.tagSearchMatch = e.detail
                                tagSearchMatchValue = e.detail
                                setShowIncludeChildTags()
                            }}
                        />
                        <SelectMenu
                            items={tagOptions}
                            label="Tag Search"
                            isMulti={true}
                            value={tagValues}
                            on:select={(e) => {
                                $data.tags = e.detail
                                tagValues = e.detail
                                setShowIncludeChildTags()
                            }}
                        />
                        {#if showIncludeChildTags}
                            <Toggle
                                bind:value={includeChildTagsValue}
                            >
                                Include child tags
                            </Toggle>
                        {/if}
                    {/if}
                {:else}
                    <div on:click={() => showAdvancedOptions = true}>Show Advanced</div>
                {/if}
            </form>
        </svelte:fragment>
    </PageNav>
<!-- </div> -->

{#if loading}
    <div class="flex flex-row items-center justify-center h-full">
        <mat-spinner></mat-spinner>
    </div>
{:else}
    <div class="w-full overflow-y-auto">
        <div class="w-11/12 mx-auto my-6 max-w-7xl">
            {#if searchResultWorks}
                <div class="flex flex-row py-4 items-center">
                    <!-- <rmx-icon name="book-open-line" class="relative -top-0.5 mr-2"></rmx-icon> -->
                    <h3 class="text-4xl font-medium">Works</h3>
                </div>
                <div
                    class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                >
                    <!--Works-->
                    {#each searchResultWorks.docs as work}
                        <WorkCard content={work} />
                    {/each}
                </div>
                <Paginator
                    {currPage}
                    totalPages={searchResultWorks.totalPages}
                    on:change={(e) => setNewPage(e.detail)}
                />
            {/if}
            {#if searchResultBlogs}
                <div class="flex flex-row py-4 items-center">
                    <!-- <rmx-icon name="cup-line" class="relative -top-0.5 mr-2"></rmx-icon> -->
                    <h3 class="text-4xl font-medium">Blogs</h3>
                </div>
                <div
                    class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                >
                    <!--Blogs-->
                    {#each searchResultBlogs.docs as blog}
                        <BlogCard blog={blog} />
                    {/each}
                </div>
                <Paginator
                    {currPage}
                    totalPages={searchResultBlogs.totalPages}
                    on:change={(e) => setNewPage(e.detail)}
                />
            {/if}
            {#if searchResultUsers}
                <div class="flex flex-row py-4 items-center">
                    <!-- <rmx-icon name="group-line" class="relative -top-0.5 mr-2"></rmx-icon> -->
                    <h3 class="text-4xl font-medium">Users</h3>
                </div>
                <div
                    class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                >
                    <!--Users-->
                    {#each searchResultUsers.docs as user}
                        <!-- <BlogCard blog={blog} /> -->
                    {/each}
                </div>
                <Paginator
                    {currPage}
                    totalPages={searchResultUsers.totalPages}
                    on:change={(e) => setNewPage(e.detail)}
                />
            {/if}
        </div>
    </div>
{/if}
