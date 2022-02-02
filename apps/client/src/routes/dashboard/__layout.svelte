<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import { page } from '$app/stores';
    import {
        Dashboard2Line,
        MistFill,
        ListUnordered,
        ClipboardLine,
        Hashtag,
        HistoryLine,
        UserLine,
        Group2Line,
    } from 'svelte-remixicon';
    import PageNav from '$lib/components/nav/PageNav.svelte';
    import { isAllowed } from '$lib/services/auth.service';
    import { Roles } from '$lib/models/accounts';
</script>

<div class="flex w-full h-screen">
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Dashboard</h3>
            <Dashboard2Line />
        </svelte:fragment>
        <svelte:fragment slot="pages">
            <a href="/dashboard" class:active={$page.url.pathname === '/dashboard'}>
                <span class="link-icon"><MistFill /></span>
                <span class="text">Overview</span>
            </a>
            <h5
                class="flex items-center text-lg font-medium mb-1 mt-2"
                style="color: var(--text-color);"
            >
                <span class="relative top-1">Content</span>
            </h5>
            <a
                href="/dashboard/approval-queue"
                class:active={$page.url.pathname.includes('approval-queue')}
            >
                <span class="link-icon"><ListUnordered /></span>
                <span class="text">Approval Queue</span>
            </a>
            <a href="/dashboard/tags" class:active={$page.url.pathname.includes('tags')}>
                <span class="link-icon"><Hashtag /></span>
                <span class="text">Tags</span>
            </a>
            {#if $session.account && isAllowed( $session.account.roles, [Roles.Admin, Roles.Moderator], )}
                <h5
                    class="flex items-center text-lg font-medium mb-1 mt-2"
                    style="color: var(--text-color);"
                >
                    <span class="relative top-1">Moderation</span>
                </h5>
                <a
                    href="/dashboard/case-files"
                    class:active={$page.url.pathname.includes('case-files')}
                >
                    <span class="link-icon"><ClipboardLine /></span>
                    <span class="text">Case Files</span>
                </a>
                <a
                    href="/dashboard/audit-log"
                    class:active={$page.url.pathname.includes('audit-log')}
                >
                    <span class="link-icon"><HistoryLine /></span>
                    <span class="text">Audit Log</span>
                </a>
                <a href="/dashboard/users" class:active={$page.url.pathname.includes('users')}>
                    <span class="link-icon"><UserLine /></span>
                    <span class="text">Users</span>
                </a>
                <a href="/dashboard/groups" class:active={$page.url.pathname.includes('groups')}>
                    <span class="link-icon"><Group2Line /></span>
                    <span class="text">Groups</span>
                </a>
            {/if}
        </svelte:fragment>
    </PageNav>
    <div class="w-full h-screen overflow-y-auto">
        <slot />
    </div>
</div>
