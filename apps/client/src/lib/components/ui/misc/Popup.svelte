<script>
    import { fade, scale } from 'svelte/transition';
</script>

<div class="absolute top-0 left-0 z-[60] w-full h-screen">
    <div
        class="absolute z-30 bg-neutral-900 w-full h-screen opacity-75 backdrop-blur-md"
        transition:fade|local={{ delay: 0, duration: 100 }}
        on:click
    />
    <div transition:scale|local={{ delay: 0, duration: 200, x: -200 }}>
        <slot />
    </div>
</div>
