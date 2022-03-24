<script lang="ts" context="module">
    import WorkCard from "$lib/components/ui/content/WorkCard.svelte";

    import Paginator from "$lib/components/ui/misc/Paginator.svelte";

    import type { Content } from "$lib/models/content";
    import type { TagsModel, TagsTree } from "$lib/models/content/works";

    import type { PaginateResult } from "$lib/models/util";
    import { app } from "$lib/repo/app.repo";
    import { search, setCurrentTag, setFilter } from "$lib/repo/search.repo";
    import { findRelatedContent } from "$lib/services/search.service";
    import { fetchDescendants } from "$lib/services/tags.service";
    import { updateUrlParams } from "$lib/util";
    import type { Load } from "@sveltejs/kit";
    import { get } from "svelte/store";
    import { slugify } from '$lib/util';
    import { onMount } from "svelte";

    let tagId: string = null;
    let page: number = 1;

    export const load: Load = async ({ params, url }) => {
        console.log("Calling load for tag page, id=" + params.id);
        tagId = params.id;
        page =  url.searchParams.has('page') ? +url.searchParams.get('page') : 1;
        setCurrentTag(tagId, page);
        return {
            props: {
                tagId: tagId,
            },
        };
    }
</script>
<script lang="ts">
    let contentResults: PaginateResult<Content> = null;
    let tagsTree: TagsTree = null;
    let parent: TagsModel = null;

    $: setFilter($app.filter);

    onMount(async () => {
        contentResults = await findRelatedContent($search);
        tagsTree = await fetchDescendants($search.tagIds[0]);
        parent = tagsTree.parent as TagsModel;
    })

    async function setNewPage(currPage: number) {
        $search.page = currPage;
        updateUrlParams({
            page: currPage > 1 ? currPage.toString() : null,
        })
        contentResults = await findRelatedContent($search);
    }
</script>

{#if tagsTree}
    <div class="text-2xl">
        {#if parent}
            <a
                href="/tag/{parent._id}/{slugify(parent.name)}"
            >{parent.name}</a>
            &nbsp;— 
        {/if}
        <span>{tagsTree.name}</span>
    </div>
    {#if tagsTree.children && tagsTree.children.length > 0}
        <span>Child Tags: </span>
        {#each tagsTree.children as child, index}
            <a
                href="/tag/{child._id}/{slugify(child.name)}"
            >{child.name}</a>
            {#if index < tagsTree.children.length - 1}
                <span>, </span>
            {/if}
        {/each}
    {/if}
    <p>{tagsTree.desc}</p>
{/if}
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