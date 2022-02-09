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
    import { Query } from '@sveltestack/svelte-query';
    import { fetchTagsTrees } from '$lib/services/tags.service';
    import { findRelatedContent, searchUsers } from '$lib/services/search.service';
    import { app } from '$lib/repo/app.repo';
    import type { PaginateResult } from '$lib/models/util';
    import type { Profile } from '$lib/models/accounts';

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

    let searchResultWorks: PaginateResult<Content>;
    let searchResultBlogs: PaginateResult<Content>;
    let searchResultNews: PaginateResult<Content>;
    let searchResultUsers: PaginateResult<Profile>;

    var loading = false;

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            console.log("Pressed enter: " + values.query)
            console.log("Genre match is " + values.genreSearchMatch.value)
            fetchData(
                values.query,
                values.kind,
                values.author,
                values.category,
                values.genreSearchMatch,
                values.genres,
                values.tagSearchMatch,
                values.tags,
                true,
                1
            )
        },
        validate: (values) => {
            const errors = {
                title: '',
                category: '',
                genres: '',
                shortDesc: '',
                longDesc: '',
                rating: '',
                status: '',
            };

            return errors;
        },
    });

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
        // this.clearResults();
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
            case SearchKind.News:
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
                    searchResultNews = results;
                    loading = false;
                });
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

<div class="flex w-full h-screen">
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
                    on:select={(selected) => {
                        $data.kind = selected.detail;
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
                        on:select={(selected) => {
                            $data.category = selected.detail;
                        }}
                    />
                    <div>Genre(s)</div>
                    <SelectMenu
                        items={genreMatchOptions}
                        label="Genre Search Match"
                        on:select={(selected) => {
                            $data.genreSearchMatch = selected.detail;
                        }}
                    />
                    <SelectMenu
                        items={genreOptions}
                        label="Genre Search"
                        isMulti={true}
                        on:select={(selected) => {
                            $data.genres = selected.detail;
                        }}
                    />
                    <div>Fandom Tag(s)</div>
                    <SelectMenu
                        items={tagMatchOptions}
                        label="Tag Search Match"
                        on:select={(selected) => {
                            $data.tagSearchMatch = selected.detail;
                        }}
                    />
                    <SelectMenu
                        items={tagOptions}
                        label="Tag Search"
                        isMulti={true}
                        on:select={(selected) => {
                            $data.tags = selected.detail;
                        }}
                    />
                {:else}
                    <div on:click={() => showAdvancedOptions = true}>Show Advanced</div>
                {/if}
            </form>
        </svelte:fragment>
    </PageNav>
    <div class="flex-1 h-screen overflow-y-auto">
        <slot />
    </div>
</div>
