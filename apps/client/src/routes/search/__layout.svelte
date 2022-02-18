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

    const searchKinds = Object.entries(SearchKind).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const categoryOptions = Object.entries(WorkKind).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const genreMatchOptions = [
        { value: SearchMatch.All, label: "Match All" },
        { value: SearchMatch.OneOrMore, label: "Match One or More" },
        { value: SearchMatch.NoOthers, label: "Match No Other Genres" },
        { value: SearchMatch.Exactly, label: "Match Exactly"}
    ];
    const genreOptions = Object.entries(Genres).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const tagMatchOptions = [
        { value: SearchMatch.All, label: "Match All" },
        { value: SearchMatch.OneOrMore, label: "Match One or More" },
        { value: SearchMatch.NoOthers, label: "Match No Other Tags" },
        { value: SearchMatch.Exactly, label: "Match Exactly"}
    ];

    let tagOptions = [];
    fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
        for (const tree of tagTrees) {
            tagOptions.push({ value: tree._id, label: tree.name })
            for (const child of tree.children) {
                tagOptions.push({ value: child._id, label: tree.name + "  —  " + child.name})
            }
        }
    })

    var showAdvancedOptions = false;

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
            const searchKind = values.searchKind ? parseKind(values.searchKind.value) : null
            const author = values.author ?? null
            const category = values.category ? parseCategoryKey(values.category.value) : null
            const genreSearchMatch = values.genreSearchMatch ? parseMatch(values.genreSearchMatch.value) : null
            const genres = values.genres ? parseGenreKeys(values.genres.map((val) => {
                return val.value;
            })) : null
            const tagSearchMatch = values.tagSearchMatch ? parseMatch(values.tagSearchMatch.value) : null
            const tags = values.tags ? values.tags.map((val) => {
                return val.value;
            }) : null
            // TODO
            const includeChildTags = true
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

    function parseKind(kindString: string): SearchKind {
        const kind: SearchKind = SearchKind[kindString];
        return Object.values(SearchKind).indexOf(kind) >= 0 ? kind : SearchKind.ProseAndPoetry;
    }

    /**
     * Categories are stored for works via their keys, so we want to return the key instead of the value
     * @param categoryString
     * @returns
     */
    function parseCategoryKey(categoryString: string): string {
        const category: WorkKind = WorkKind[categoryString];
        return Object.values(WorkKind).indexOf(category) >= 0 ? categoryString : null;
    }

    /**
     * Genres are stored for works via their keys, so we want to return the keys instead of the values
     * (i.e. ScienceFiction instead of Science Fiction)
     * @param genreStrings
     * @returns
     */
    function parseGenreKeys(genreStrings: string[]): string[] {
        const genreList: string[] = [];
        if (genreStrings) {
            for (const genreString of genreStrings) {
                if (Object.values(Genres).indexOf(Genres[genreString]) >= 0) {
                    genreList.push(genreString);
                }
            }
        }

        return genreList;
    }

    function parseMatch(matchString: string): SearchMatch {
        const match: SearchMatch = SearchMatch[matchString];
        return Object.values(SearchMatch).indexOf(match) >= 0 ? match : SearchMatch.All;
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
                    errorMessage={$errors.query}
                />
                <Button type="submit">
                    <span class="button-text">Search</span>
                </Button>

                <SelectMenu
                    items={searchKinds}
                    label="Search Kind"
                    on:select={(e) => {
                        $data.searchKind = e.detail;
                    }}
                />
                {#if showAdvancedOptions}
                    <div on:click={() => showAdvancedOptions = false}>Hide Advanced</div>
                    <!-- <ng-container *ngIf="searchForm.controls.kind.value !== kindOptions.User"></ng-container>
                    {#if values.searchKind.value != }
                    {/if} -->
                    <TextField
                        name="author"
                        type="text"
                        title="Author"
                        placeholder="Search..."
                        errorMessage={$errors.author}
                    />
                    <SelectMenu
                        items={categoryOptions}
                        label="Category"
                        on:select={(e) => {
                            $data.category = e.detail;
                        }}
                    />
                    <div>Genre(s)</div>
                    <SelectMenu
                        items={genreMatchOptions}
                        label="Genre Search Match"
                        on:select={(e) => {
                            $data.genreSearchMatch = e.detail;
                        }}
                    />
                    <SelectMenu
                        items={genreOptions}
                        label="Genre Search"
                        isMulti={true}
                        on:select={(e) => {
                            $data.genres = e.detail;
                        }}
                    />
                    <div>Fandom Tag(s)</div>
                    <SelectMenu
                        items={tagMatchOptions}
                        label="Tag Search Match"
                        on:select={(e) => {
                            $data.tagSearchMatch = e.detail;
                        }}
                    />
                    <SelectMenu
                        items={tagOptions}
                        label="Tag Search"
                        isMulti={true}
                        on:select={(e) => {
                            $data.tags = e.detail;
                        }}
                    />
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
