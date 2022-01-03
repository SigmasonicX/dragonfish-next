<script lang="ts">
    // TODO: adjust styles for site

    import Select from 'svelte-select';

    export let items;
    export let value;
    export let placeholder = 'Select items...';
    export let isClearable = false;
    export let label = '';
</script>

<label
    class="text-[0.625rem] relative z-20 top-[0.15rem] left-1 py-0.5 px-1 rounded-t-lg font-semibold tracking-wider uppercase"
    >{label}</label
>
<Select {items} {value} {placeholder} {isClearable} containerClasses="offprint-select" on:select />

<style lang="scss">
    :global(.offprint-select) {
        color: var(--text-color) !important;
        border-radius: 0.5rem !important;
        background: var(--select-bg) !important;
        border-top: 1px solid transparent !important;
        border-left: 1px solid transparent !important;
        border-right: 1px solid transparent !important;
        border-bottom: 4px solid transparent !important;

        :global(&.focused) {
            border-color: var(--borders) !important;
        }

        :global(input[type='text']:focus) {
            border-color: transparent !important;
        }

        :global(div.listContainer) {
            background: var(--select-bg) !important;
            border-radius: 0.6rem !important;

            :global(.item) {
                cursor: pointer;
            }

            :global(.item.active) {
                background: var(--accent) !important;
            }

            :global(.item.hover) {
                background: var(--accent-light) !important;
            }
        }
    }
</style>
