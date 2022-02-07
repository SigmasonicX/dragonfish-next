<script lang="ts" context="module">
    import { get } from 'svelte/store';
    import type { Load } from '@sveltejs/kit';
    import { fetchShelf } from '$lib/services/content-library.service';
    import { session } from '$lib/repo/session.repo';

    export const load: Load = async ({ params }) => {
        const shelfId: string = params.id;

        const bookshelf = await fetchShelf(get(session).currProfile._id, shelfId);

        return {
            props: {
                shelf: bookshelf,
            },
        };
    };
</script>

<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import type { Bookshelf } from '$lib/models/content/library';
    import { CloseLine, Loader5Line } from 'svelte-remixicon';
    import BookshelfHeader from '$lib/components/ui/content/BookshelfHeader.svelte';

    export let shelf: Bookshelf;

    const thisShelf = useQuery('shelfPage', () => fetchShelf($session.currProfile._id, shelf._id), {
        initialData: shelf,
    });
</script>

{#if $thisShelf.isLoading}
    <div class="h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <Loader5Line class="mr-2 animate-spin" size="24px" />
            <span class="text-lg uppercase font-bold tracking-widest">Loading...</span>
        </div>
    </div>
{:else if $thisShelf.isError}
    <div class="h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <CloseLine class="mr-2 animate-spin" size="24px" />
            <span class="text-lg uppercase font-bold tracking-widest"
                >Error fetching this shelf!</span
            >
        </div>
    </div>
{:else}
    <div class="flex-1 h-screen overflow-y-auto">
        <div class="w-11/12 mx-auto md:max-w-4xl my-6">
            <BookshelfHeader shelf={$thisShelf.data} />
        </div>
    </div>
{/if}
