<script lang="ts">
    import { pluralize, localeDate } from '$lib/util';
    import type { Bookshelf } from '$lib/models/content/library';
    import { BarChart2Fill } from 'svelte-remixicon';

    export let shelf: Bookshelf;
</script>

<div class="shelf-header">
    <div class="shelf-cover">
        <BarChart2Fill size="36px" />
    </div>
    <div class="shelf-info">
        <h3 class="text-3xl font-medium text-white">{shelf.name}</h3>
        <span>{shelf.desc ? shelf.desc : ''}</span>
        <span class="italic">
            {localeDate(shelf.createdAt, 'mediumDate')} • {shelf.works} work{pluralize(shelf.works)}
        </span>
    </div>
</div>

<style lang="scss">
    div.shelf-header {
        @apply w-full rounded-lg p-4 flex items-center;
        background: var(--accent);
        div.shelf-cover {
            @apply w-36 h-36 border-4 rounded-lg border-white flex flex-col items-center justify-center mr-4;
        }
        div.shelf-info {
            @apply flex-1 flex flex-col text-white;
        }
    }
</style>
