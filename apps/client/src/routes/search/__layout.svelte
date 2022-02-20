<script lang="ts">
    import { createForm } from 'felte';
    import { page } from '$app/stores';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import PageNav from '$lib/components/nav/PageNav.svelte';
    import { TeamLine, Group2Line, RssFill, Save2Line } from 'svelte-remixicon';
    import { Content, SearchKind, SearchMatch } from '$lib/models/content';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import { Genres, TagKind, WorkKind } from '$lib/models/content/works';
    import { fetchTagsTrees } from '$lib/services/tags.service';
    import { findRelatedContent, searchUsers } from '$lib/services/search.service';
    import { app } from '$lib/repo/app.repo';
    import type { PaginateResult } from '$lib/models/util';
    import type { Profile } from '$lib/models/accounts';
    import BlogCard from '$lib/components/ui/content/BlogCard.svelte';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import Paginator from '$lib/components/ui/misc/Paginator.svelte';
    import Toggle from '$lib/components/forms/Toggle.svelte';

    const searchKinds = Object.entries(SearchKind).map(([key, value]) => ({
        value: key,
        label: value,
    }));

    const anyOption = "Any"

    const categoryOptions: Array<any> = Object.entries(WorkKind).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1));
    categoryOptions.push({
        value: anyOption,
        label: anyOption,
    });

    const matchAllOption = { value: SearchMatch.All, label: "Match All" }

    const genreMatchOptions = [
        matchAllOption,
        { value: SearchMatch.OneOrMore, label: "Match One or More" },
        { value: SearchMatch.NoOthers, label: "Match No Other Genres" },
        { value: SearchMatch.Exactly, label: "Match Exactly"}
    ];
    const genreOptions = Object.entries(Genres).map(([key, value]) => ({
        value: key,
        label: value,
    })).sort((a, b) => (a.value < b.value ? -1 : 1));

    const tagMatchOptions = [
        matchAllOption,
        { value: SearchMatch.OneOrMore, label: "Match One or More" },
        { value: SearchMatch.NoOthers, label: "Match No Other Tags" },
        { value: SearchMatch.Exactly, label: "Match Exactly"}
    ];

    const tagOptions = [];
    fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
        for (const tree of tagTrees) {
            tagOptions.push({ value: tree._id, label: tree.name, isParent: (tree.children.length > 0) })
            for (const child of tree.children) {
                tagOptions.push({ value: child._id, label: tree.name + "  —  " + child.name, isParent: false})
            }
        }
    })

    var showAdvancedOptions = false

    var initialQuery: string = null
    var selectedSearchKind: SearchKind = SearchKind.ProseAndPoetry
    var initialAuthor: string = null
    var selectedCategory: WorkKind | string = anyOption
    var selectedGenreSearchMatch: any = matchAllOption
    var selectedGenreEntries: any[] = null

    var selectedTagSearchMatch: any = matchAllOption
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

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            const query = values.query ?? null
            const searchKind = selectedSearchKind
            const author = values.author ?? null
            const category = selectedCategory
            const genreSearchMatch = parseMatch(values.genreSearchMatch)
            const genres = parseGenreKeys(values.genres)
            const tagSearchMatch = parseMatch(values.tagSearchMatch)
            const tags = values.tags ? values.tags.map((val) => {
                return val.value;
            }) : null
            const includeChildTags = selectedIncludeChildTags && showIncludeChildTags;
            // TODO
            const pageNum = 1

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

    function parseKind(kindValue: any): SearchKind {
        const kindString: string = kindValue ? kindValue.value : null;
        const kind: SearchKind = SearchKind[kindString];
        return Object.values(SearchKind).indexOf(kind) >= 0 ? kind : SearchKind.ProseAndPoetry;
    }

    /**
     * Categories are stored for works via their keys, so we want to return the key instead of the value
     * @param categoryValue
     * @returns
     */
    function parseCategoryKey(categoryValue: any): string {
        const categoryString: string = categoryValue ? categoryValue.value : anyOption;
        const category: WorkKind = WorkKind[categoryString];
        return Object.values(WorkKind).indexOf(category) >= 0 ? categoryString : anyOption;
    }

    function parseMatch(matchValue: any): SearchMatch {
        const matchString: string = matchValue ? matchValue.value : null;
        const match: SearchMatch = SearchMatch[matchString];
        return Object.values(SearchMatch).indexOf(match) >= 0 ? match : SearchMatch.All;
    }

    /**
     * Genres are stored for works via their keys, so we want to return the key values instead of the labels
     * (i.e. ScienceFiction instead of Science Fiction)
     * @param genreValues
     * @returns
     */
    function parseGenreKeys(genreValues: any[]): string[] {
        const genreList: string[] = [];
        if (genreValues) {
            for (const genreValue of genreValues) {
                const genreString = genreValue.value;
                if (Object.values(Genres).indexOf(Genres[genreString]) >= 0) {
                    genreList.push(genreString);
                }
            }
        }

        return genreList;
    }

    function setShowIncludeChildTags() {
        if (selectedTagEntries && selectedTagSearchMatch !== SearchMatch.Exactly) {
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
        searchKind: SearchKind,
        author: string | null,
        searchCategory: string | null,
        genreSearchMatch: SearchMatch,
        genres: string[] | null,
        tagSearchMatch: SearchMatch,
        tagIds: string[] | null,
        includeChildTags: boolean,
        pageNum: number
    ) {
        loading = true;
        clearResults();
        switch(searchKind) {
            case SearchKind.Blog:
                findRelatedContent(
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
                searchUsers(query, pageNum).subscribe((results) => {
                    searchResultUsers = results;
                    loading = false;
                });
                break;
            case SearchKind.Poetry:
            case SearchKind.ProseAndPoetry:
            case SearchKind.Prose:
            default:
                findRelatedContent(
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
                    value={selectedSearchKind}
                    on:select={(e) => {
                        $data.searchKind = e.detail
                        selectedSearchKind = parseKind(e.detail)
                    }}
                />
                {#if showAdvancedOptions}
                    <div on:click={() => showAdvancedOptions = false}>Hide Advanced</div>
                    {#if selectedSearchKind !== SearchKind.User}
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
                            value={selectedCategory}
                            on:select={(e) => {
                                $data.category = e.detail
                                selectedCategory = parseCategoryKey(e.detail)
                            }}
                        />
                        <div>Genre(s)</div>
                        <SelectMenu
                            items={genreMatchOptions}
                            label="Genre Search Match"
                            value={selectedGenreSearchMatch}
                            on:select={(e) => {
                                $data.genreSearchMatch = e.detail;
                                selectedGenreSearchMatch = parseMatch(e.detail);
                            }}
                        />
                        <SelectMenu
                            items={genreOptions}
                            label="Genre Search"
                            isMulti={true}
                            value={selectedGenreEntries}
                            on:select={(e) => {
                                $data.genres = e.detail;
                                selectedGenreEntries = e.detail;
                            }}
                        />
                        <div>Fandom Tag(s)</div>
                        <SelectMenu
                            items={tagMatchOptions}
                            label="Tag Search Match"
                            value={selectedTagSearchMatch}
                            on:select={(e) => {
                                $data.tagSearchMatch = e.detail;
                                selectedTagSearchMatch = parseMatch(e.detail)
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
