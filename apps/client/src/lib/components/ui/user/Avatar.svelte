<script lang="ts">
    export let src: string;
    export let alt = 'avatar';
    export let size = '12rem';
</script>

<div
    class="rounded-full border-4 border-zinc-300 dark:border-white bg-zinc-300 dark:bg-white overflow-hidden"
    style="min-height: {size}; min-width: {size}; max-height: {size}; max-width: {size}"
>
    <img {src} {alt} class="object-contain w-full h-full" />
</div>
