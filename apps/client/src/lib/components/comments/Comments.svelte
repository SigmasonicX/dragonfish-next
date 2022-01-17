<script lang="ts">
    import { comments } from '$lib/repo/comments.repo';
    import { session } from '$lib/repo/session.repo';
    import CommentBox from '$lib/components/comments/CommentBox.svelte';
    import CommentForm from './CommentForm.svelte';
</script>

{#if $session.currProfile}
    <CommentForm />
{/if}

<div class="w-full border-b border-zinc-700 dark:border-white my-6"><!--separator--></div>

{#if $comments.totalComments === 0}
    <div class="my-6">
        <div class="empty">
            <h3>No one's posted anything yet...</h3>
            <p>But you could be the first!</p>
        </div>
    </div>
{:else}
    {#each $comments.comments as comment}
        <CommentBox {comment} />
    {/each}
{/if}
