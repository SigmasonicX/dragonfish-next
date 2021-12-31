<script lang="ts">
    enum InboxTabs {
        Messages,
        Activity,
    }

    let selectedTab = InboxTabs.Activity;
</script>

<div class="flex flex-col w-full h-screen">
    <div class="header">
        <div class="nav">
            <button
                class="rounded-l-lg border border-white border-r-0"
                on:click={() => (selectedTab = InboxTabs.Activity)}
                class:active={selectedTab === InboxTabs.Activity}
            >
                <span class="button-icon">
                    <span class="notification-badge">0</span>
                </span>
                <span class="button-text">Activity</span>
            </button>
            <button
                class="rounded-r-lg border border-white"
                on:click={() => (selectedTab = InboxTabs.Messages)}
                class:active={selectedTab === InboxTabs.Messages}
            >
                <span class="button-icon">
                    <span class="notification-badge">0</span>
                </span>
                <span class="button-text">Messages</span>
            </button>
        </div>
    </div>
    <div class="p-4 h-full overflow-y-auto">
        {#if selectedTab === InboxTabs.Messages}
            <div class="empty">
                <h3>Pardon our dust—</h3>
                <p>Check back later!</p>
            </div>
        {:else if selectedTab === InboxTabs.Activity}
            <div class="empty">
                <h3>Pardon our dust—</h3>
                <p>Check back later!</p>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    div.header {
        @apply p-8;
        background: var(--accent);

        div.nav {
            @apply flex items-center justify-center;
            button {
                @apply text-white flex items-center justify-center py-2 transition w-1/2;
                span.button-text {
                    @apply uppercase font-bold tracking-wider text-xs mt-0.5 ml-1;
                }

                span.button-icon {
                    @apply flex items-center;
                }

                span.notification-badge {
                    @apply py-0.5 px-2 ml-1 text-sm rounded-lg;
                    background: var(--accent-light);
                }

                &:hover,
                &.active {
                    background: var(--accent-light);
                }
            }
        }
    }
</style>
