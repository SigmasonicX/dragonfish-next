<div class="w-full h-screen flex flex-col">
    <div class="topbar">
        <div class="flex-1 text-center uppercase text-sm font-bold tracking-widest">Create New Content</div>
    </div>
</div>

<style lang="scss">
    div.topbar {
        @apply w-full p-4 flex items-center drop-shadow-xl relative z-40;
        background: var(--accent);

        button {
            @apply rounded-full p-1 border border-white transition transform text-white;
            &:hover {
                @apply scale-105;
            }

            &:active {
                @apply scale-100;
            }
        }
    }
</style>