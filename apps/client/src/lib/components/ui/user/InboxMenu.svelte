<script lang="ts">
  import { InboxLine, Chat1Line, Notification2Line } from "svelte-remixicon";

  enum InboxTabs {
    Messages,
    Notifications,
  }

  let selectedTab = InboxTabs.Messages;
</script>

<div class="flex flex-col w-full h-screen">
  <div class="header">
    <div class="heading">
      <h2 class="text-4xl text-white font-medium">Inbox</h2>
      <div class="flex-1"></div>
      <InboxLine size="2rem" />
    </div>
    <div class="nav">
      <button
        class="rounded-l-lg border border-white border-r-0"
        on:click={() => selectedTab = InboxTabs.Messages}
        class:active={selectedTab === InboxTabs.Messages}
      >
        <span class="button-icon">
          <Chat1Line size="1.25rem" />
          <span class="notification-badge">0</span>
        </span>
        <span class="button-text">Messages</span>
      </button>
      <button
        class="rounded-r-lg border border-white"
        on:click={() => selectedTab = InboxTabs.Notifications}
        class:active={selectedTab === InboxTabs.Notifications}
      >
        <span class="button-icon">
          <Notification2Line size="1.25rem" />
          <span class="notification-badge">0</span>
        </span>
        <span class="button-text">Notifications</span>
      </button>
    </div>
  </div>
  <div class="p-4 h-full overflow-y-auto">
    {#if selectedTab === InboxTabs.Messages}
      <div class="empty">
        <h3>Pardon our dust—</h3>
        <p>Check back later!</p>
      </div>
    {:else if selectedTab === InboxTabs.Notifications}
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
    div.heading {
      @apply flex items-center text-white;
    }
    div.nav {
      @apply flex items-center justify-center mt-2;
      button {
        @apply text-white flex flex-col items-center justify-center py-2 transition w-1/2;
        span.button-text {
          @apply uppercase font-bold tracking-wider text-xs mt-1;
        }
        span.button-icon {
          @apply flex items-center;
        }
        span.notification-badge {
          @apply py-0.5 px-2 ml-1 text-sm rounded-lg;
          background: var(--accent-light);
        }
        &:hover, &.active {
          background: var(--accent-light);
        }
      }
    }
  }
</style>