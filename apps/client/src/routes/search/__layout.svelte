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

    const searchKinds = Object.entries(SearchKind).map(([key, value]) => ({
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

    const tagOptions = [];
    tags.fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
        for (const tree of tagTrees) {
            tagOptions.push({ value: tree._id, label: tree.name, isParent: (tree.children.length > 0) })
            for (const child of tree.children) {
                tagOptions.push({ value: child._id, label: tree.name + "  —  " + child.name, isParent: false})
            }
        }
    })

    var showAdvancedOptions = false

    var initialQuery: string = $page.url.searchParams.has('query') ?
        $page.url.searchParams.get('query') :
        null
    var selectedSearchKindKey: string = $page.url.searchParams.has('kind') ?
        parseSearchKindKey($page.url.searchParams.get('kind')) :
        searchKindDefaultKey
    var initialAuthor: string = $page.url.searchParams.has('author') ?
        $page.url.searchParams.get('author') :
        null
    var selectedCategoryKey: string = $page.url.searchParams.has('category') ?
        parseCategoryKey($page.url.searchParams.get('category')) :
        anyOption
    var selectedGenreSearchMatchKey: string = $page.url.searchParams.has('genreSearchMatch') ?
        parseMatchKey($page.url.searchParams.get('genreSearchMatch')) :
        searchMatchDefaultKey
    var selectedGenreKeys: string[] = $page.url.searchParams.has('genres') ?
        parseGenreKeys($page.url.searchParams.get('genres').split(',')) :
        null

    var selectedTagSearchMatchKey: string = $page.url.searchParams.has('tagSearchMatch') ?
        parseMatchKey($page.url.searchParams.get('tagSearchMatch')) :
        searchMatchDefaultKey
    var selectedTagEntries: any[] = null
    var showIncludeChildTags = false
    var selectedIncludeChildTags = true

    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;
    function setNewPage(pageNum: number) {
        currPage = pageNum;
    }

    let searchResultWorks: PaginateResult<Content>;
    let searchResultBlogs: PaginateResult<Content>;
    let searchResultUsers: PaginateResult<Profile>;

    var loading = false;

    // Fetch results for URL params
    // if ($page.url.searchParams.entries.length > 0) {
    //     const query = initialQuery
    //     const searchKind = selectedSearchKind
    //     const author = initialAuthor
    //     const category = selectedCategoryKey
    //     const genreSearchMatch = parseMatch(values.genreSearchMatch)
    //     const genres = parseGenreKeys(values.genres)
    //     const tagSearchMatch = parseMatch(values.tagSearchMatch)
    //     const tags: string[] = values.tags ? values.tags.map((val) => {
    //         return val.value as string
    //     }) : null
    //     const includeChildTags = selectedIncludeChildTags
    //     // TODO
    //     const pageNum = 1
    //     fetchData(
    //         query,
    //         searchKind,
    //         author,
    //         category,
    //         genreSearchMatch,
    //         genres,
    //         tagSearchMatch,
    //         tags,
    //         includeChildTags,
    //         1
    //     )
    // }

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            const query = values.query ?? null
            const searchKind = selectedSearchKindKey
            const author = values.author ?? null
            const category = selectedCategoryKey
            const genreSearchMatch = selectedGenreSearchMatchKey
            const genres = parseGenreKeys(values.genres)
            const tagSearchMatch = selectedTagSearchMatchKey
            const tags: string[] = values.tags ? values.tags.map((val) => {
                return val.value as string
            }) : null
            const includeChildTags = selectedIncludeChildTags
            // TODO
            const pageNum = 1

            $page.url.searchParams.forEach((_value, key, parent) => (
                parent.delete(key)
            ))
            if (query) {
                $page.url.searchParams.set('query', query)
            }
            if (searchKind && SearchKind[searchKind] !== SearchKind.ProseAndPoetry) {
                $page.url.searchParams.set('kind', searchKind)
            }
            if (searchKind !== SearchKind.User) {
                if (author) {
                    $page.url.searchParams.set('author', author)
                }
                if (category && category !== anyOption) {
                    $page.url.searchParams.set('category', category)
                }
                if (genres && genres.length > 0) {
                    if (genreSearchMatch && SearchMatch[genreSearchMatch] !== SearchMatch.All) {
                        $page.url.searchParams.set('genreSearchMatch', genreSearchMatch)
                    }
                    $page.url.searchParams.set('genres', genres.toString())
                }
                if (tags && tags.length > 0) {
                    if (tagSearchMatch && SearchMatch[tagSearchMatch] !== SearchMatch.All) {
                        $page.url.searchParams.set('tagSearchMatch', tagSearchMatch)
                    }
                    $page.url.searchParams.set('tags', tags.toString())
                    if (showIncludeChildTags) {
                        $page.url.searchParams.set('includeChildTags', includeChildTags.toString())
                    }
                }
            }
            if (pageNum && pageNum > 0) {
                $page.url.searchParams.set('page', pageNum.toString())
            }
            goto($page.url.toString())

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
                1
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
     * @returns The provided key and its Genre value as an object of the form {value, label}
     */
    function createGenreMenuItems(genreKeys: string[]) {
        if (genreKeys) {
            return genreKeys.map((value) => ({value: value, label: Genres[value]}))
        }
        return null
    }

    function setShowIncludeChildTags() {
        if (selectedTagEntries && selectedTagSearchMatchKey !== SearchMatch.Exactly) {
            for (const tag of selectedTagEntries) {
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
                    value={initialQuery}
                    errorMessage={$errors.query}
                />
                <Button type="submit">
                    <span class="button-text">Search</span>
                </Button>

                <SelectMenu
                    items={searchKinds}
                    label="Search Kind"
                    value={createSearchKindMenuItem(selectedSearchKindKey)}
                    on:select={(e) => {
                        $data.searchKind = e.detail
                        selectedSearchKindKey = parseSearchKindKey(e.detail)
                    }}
                />
                {#if showAdvancedOptions}
                    <div on:click={() => showAdvancedOptions = false}>Hide Advanced</div>
                    {#if SearchKind[selectedSearchKindKey] !== SearchKind.User}
                        <TextField
                            name="author"
                            type="text"
                            title="Author"
                            placeholder="Search..."
                            value={initialAuthor}
                            errorMessage={$errors.author}
                        />
                        <SelectMenu
                            items={categoryOptions}
                            label="Category"
                            value={createCategoryMenuItem(selectedCategoryKey)}
                            on:select={(e) => {
                                $data.category = e.detail
                                selectedCategoryKey = parseCategoryKey(e.detail)
                            }}
                        />
                        <div>Genre(s)</div>
                        <SelectMenu
                            items={genreMatchOptions}
                            label="Genre Search Match"
                            value={createMatchMenuItem(selectedGenreSearchMatchKey)}
                            on:select={(e) => {
                                $data.genreSearchMatch = e.detail;
                                selectedGenreSearchMatchKey = parseMatchKey(e.detail);
                            }}
                        />
                        <SelectMenu
                            items={genreOptions}
                            label="Genre Search"
                            isMulti={true}
                            value={createGenreMenuItems(selectedGenreKeys)}
                            on:select={(e) => {
                                $data.genres = e.detail;
                                selectedGenreKeys = parseGenreKeys(e.detail);
                            }}
                        />
                        <div>Fandom Tag(s)</div>
                        <SelectMenu
                            items={tagMatchOptions}
                            label="Tag Search Match"
                            value={createMatchMenuItem(selectedTagSearchMatchKey)}
                            on:select={(e) => {
                                $data.tagSearchMatch = e.detail;
                                selectedTagSearchMatchKey = parseMatchKey(e.detail)
                                setShowIncludeChildTags();
                            }}
                        />
                        <SelectMenu
                            items={tagOptions}
                            label="Tag Search"
                            isMulti={true}
                            value={selectedTagEntries}
                            on:select={(e) => {
                                $data.tags = e.detail;
                                selectedTagEntries = e.detail;
                                setShowIncludeChildTags();
                            }}
                        />
                        {#if showIncludeChildTags}
                            <Toggle
                                bind:value={selectedIncludeChildTags}
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
