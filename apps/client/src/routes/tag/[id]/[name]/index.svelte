<script lang="ts" context="module">
    import WorkCard from "$lib/components/ui/content/WorkCard.svelte";

    import Paginator from "$lib/components/ui/misc/Paginator.svelte";

    import type { Content } from "$lib/models/content";
    import type { TagsTree } from "$lib/models/content/works";

    import type { PaginateResult } from "$lib/models/util";
    import { app } from "$lib/repo/app.repo";
    import { search, setFilter } from "$lib/repo/search.repo";
    import { findRelatedContent } from "$lib/services/search.service";
    import { fetchDescendants } from "$lib/services/tags.service";
    import { updateUrlParams } from "$lib/util";
    import type { Load } from "@sveltejs/kit";
    import { get } from "svelte/store";

    let contentResults: PaginateResult<Content> = null;
    let tagsTree: TagsTree = null;
    setFilter(get(app).filter);

    export const load: Load = async ({ params, url }) => {
        get(search).tagIds = [params.id];
        get(search).page = url.searchParams.has('page') ? +url.searchParams.get('page') : 1;

        contentResults = await findRelatedContent(get(search));
        fetchDescendants(params.id).subscribe((tree) => {
            tagsTree = tree;
        });
        return {
            props: {
                content: contentResults
            },
        };
    }

    async function setNewPage(currPage: number) {
        get(search).page = currPage;
        updateUrlParams({
            page: currPage > 1 ? currPage.toString() : null,
        })
        contentResults = await findRelatedContent(get(search));
    }
</script>

<div class="w-full h-[calc(100vh-51px)] md:h-screen overflow-y-auto">
    {#if contentResults && contentResults.totalDocs > 0}
        <div
            class="w-11/12 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4"
        >
            {#each contentResults.docs.filter((work) => work.author !== null) as work}
                <WorkCard content={work} />
            {/each}
        </div>
        <Paginator
            currPage={$search.page}
            totalPages={contentResults.totalPages}
            on:change={(e) => setNewPage(e.detail)}
        />
    {:else}
        <div class="w-full flex flex-col items-center justify-center h-96">
            <div class="flex items-center">
                <span class="uppercase tracking-widest font-bold">No results found</span>
            </div>
        </div>
    {/if}
</div>