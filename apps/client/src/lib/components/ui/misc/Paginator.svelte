<script lang="ts">
    import { ArrowLeftSLine, ArrowRightSLine } from 'svelte-remixicon';
    import { createEventDispatcher } from 'svelte';

    export let currentPage;
    export let lastPage;
    export let perPage;
    export let from;
    export let to;
    export let total;

    const dispatch = createEventDispatcher();

    function range(size, startAt = 0) {
        return [...Array(size).keys()].map((i) => i + startAt);
    }

    function changePage(page: number) {
        if (page !== currentPage) {
            dispatch('change', page);
        }
    }
</script>

<div class="pagination">
    <ul>
        <li class:disabled={currentPage === 1}>
            <button on:click={() => changePage(currentPage - 1)}>
                <ArrowLeftSLine />
            </button>
        </li>
        {#each range(lastPage, 1) as page}
            <li class:active={page === currentPage}>
                <button on:click={() => changePage(page)}>
                    {page}
                </button>
            </li>
        {/each}
        <li class:disabled={currentPage === lastPage}>
            <button on:click={() => changePage(currentPage + 1)}>
                <ArrowRightSLine />
            </button>
        </li>
    </ul>
</div>

<style lang="scss">
    div.pagination {
        @apply w-full;
        ul {
            @apply flex items-center justify-center;
        }
    }
</style>
