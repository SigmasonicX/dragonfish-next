<script lang="ts">
    import { CloseLine } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
</script>

<div class="upload-container bg-zinc-300 dark:bg-zinc-700">
    <div
        class="w-96 h-48 border-4 border-dashed rounded-lg flex flex-col items-center justify-center"
    >
        <h3 class="font-medium text-2xl">Drag & Drop To Upload</h3>
        <span class="text-sm">or click here</span>
    </div>
</div>

<style lang="scss">
    div.upload-container {
        @apply rounded-lg p-4;
        box-shadow: var(--dropshadow);
    }
</style>
