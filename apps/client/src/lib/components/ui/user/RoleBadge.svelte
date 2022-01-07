<script lang="ts">
    import * as lodash from 'lodash';
    import { Roles } from '$lib/models/accounts';
    import {
        AuctionLine,
        Scales3Line,
        ChatPrivateLine,
        BugLine,
        ServiceLine,
        BookReadLine,
        VipDiamondLine,
        CopperCoinLine,
    } from 'svelte-remixicon';

    export let roles: Roles[] = [];
    export let size: 'small' | 'normal' = 'normal';

    function determineProminentRole() {
        // this will totally need retooling to figure out a much better way to verify what the top-level
        // role is
        const hasAdmin = lodash.intersection([Roles.Admin], roles);
        const hasModerator = lodash.intersection([Roles.Moderator], roles);
        const hasChatModerator = lodash.intersection([Roles.ChatModerator], roles);
        const hasMaintainer = lodash.intersection([Roles.Maintainer], roles);
        const hasContributor = lodash.intersection([Roles.Contributor], roles);
        const hasWorkApprover = lodash.intersection([Roles.WorkApprover], roles);
        const hasVIP = lodash.intersection([Roles.VIP], this.roles);
        const hasSupporter = lodash.intersection([Roles.Supporter], roles);

        if (hasAdmin.length > 0) {
            return Roles.Admin;
        } else if (hasModerator.length > 0) {
            return Roles.Moderator;
        } else if (hasChatModerator.length > 0) {
            return Roles.ChatModerator;
        } else if (hasMaintainer.length > 0) {
            return Roles.Maintainer;
        } else if (hasContributor.length > 0) {
            return Roles.Contributor;
        } else if (hasWorkApprover.length > 0) {
            return Roles.WorkApprover;
        } else if (hasVIP.length > 0) {
            return Roles.VIP;
        } else if (hasSupporter.length > 0) {
            return Roles.Supporter;
        } else {
            return Roles.User;
        }
    }
</script>

{#if determineProminentRole() === Roles.Admin}
    <div class="role admin" class:small={size === 'small'} title="Admin">
        <AuctionLine class="badge-icon" />
    </div>
{:else if determineProminentRole() === Roles.Moderator}
    <div class="role moderator" class:small={size === 'small'} title="Moderator">
        <Scales3Line class="badge-icon" />
    </div>
{:else if determineProminentRole() === Roles.ChatModerator}
    <div class="role chat-moderator" class:small={size === 'small'} title="Chat Moderator">
        <ChatPrivateLine class="badge-icon" />
    </div>
{:else if determineProminentRole() === Roles.Maintainer}
    <div class="role maintainer" class:small={size === 'small'} title="Maintainer">
        <BugLine class="badge-icon" />
    </div>
{:else if determineProminentRole() === Roles.Contributor}
    <div class="role contributor" class:small={size === 'small'} title="Contributor">
        <ServiceLine class="badge-icon" />
    </div>
{:else if determineProminentRole() === Roles.WorkApprover}
    <div class="role work-approver" class:small={size === 'small'} title="Work Approver">
        <BookReadLine class="badge-icon" />
    </div>
{:else if determineProminentRole() === Roles.VIP}
    <div class="role vip" class:small={size === 'small'} title="VIP">
        <VipDiamondLine class="badge-icon" />
    </div>
{:else if determineProminentRole() === Roles.Supporter}
    <div class="role supporter" class:small={size === 'small'} title="Supporter">
        <CopperCoinLine class="badge-icon" />
    </div>
{/if}

<style lang="scss">
    div.role {
        @apply text-white rounded-md p-1 m-0.5;
        &.admin {
            @apply bg-red-700;
        }

        &.moderator {
            @apply bg-yellow-400;
        }

        &.chat-moderator {
            @apply bg-yellow-700;
        }

        &.maintainer {
            @apply bg-green-800;
        }

        &.contributor {
            @apply bg-blue-500;
        }

        &.work-approver {
            @apply bg-purple-600;
        }

        &.vip {
            @apply bg-green-400;
        }

        &.supporter {
            @apply bg-pink-600;
        }

        &.small {
            @apply flex flex-col items-center justify-center;
            padding: 0.075rem;

            .badge-icon {
                @apply w-5 block;
                height: 20px;
            }
        }
    }
</style>
