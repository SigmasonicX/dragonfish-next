<script lang="ts">
    import type { Comment } from '$lib/models/comments';
    import { localeDate } from '$lib/util';
    import { More2Line, ReplyLine, Emotion2Line } from 'svelte-remixicon';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';

    export let comment: Comment;
</script>

<div class="comment-box border border-zinc-700 dark:border-white">
    <div class="flex items-center border-b border-zinc-700 dark:border-white px-2 py-0.5">
        <Avatar src={comment.user.profile.avatar} size="2.5rem" borderWidth="2px" />
        <div class="ml-2 flex-1">
            <h5 class="text-lg font-medium relative top-1">{comment.user.screenName}</h5>
            <div class="flex items-center relative bottom-1">
                {#if comment.user.profile.tagline}
                    {#if comment.user.profile.tagline === 'null'}
                        <span class="text-xs relative top-0.5">Member</span>
                    {:else}
                        <span class="text-xs relative top-0.5">{comment.user.profile.tagline}</span>
                    {/if}
                {:else}
                    <span class="text-xs relative top-0.5">Member</span>
                {/if}
                <span class="mx-1">•</span>
                <span class="text-xs relative top-0.5"
                    >{localeDate(comment.createdAt, 'shortDate')}</span
                >
            </div>
        </div>
        <Button>
            <ReplyLine class="button-icon" />
            <span class="button-text">Reply</span>
        </Button>
        <div class="mx-0.5"><!--separator--></div>
        <Button>
            <More2Line size="20px" class="button-icon no-text" />
        </Button>
    </div>
    <div class="comment-body px-4 flex-1">
        {@html comment.body}
    </div>
    <div class="flex items-center justify-end p-0.5">
        <button
            class="flex items-center rounded-lg p-2 hover:bg-transparent text-zinc-500 hover:text-zinc-700"
        >
            <Emotion2Line class="mr-1" size="14px" />
            <span class="text-xs relative top-[0.075rem]"> React </span>
        </button>
    </div>
</div>

<style lang="scss">
    div.comment-box {
        @apply flex flex-col w-full min-h-[14rem] rounded-lg my-4;
    }
</style>
