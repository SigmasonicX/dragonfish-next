<script lang="ts">
    import { content } from '$lib/repo/content.repo';
    import { session } from '$lib/repo/session.repo';
    import { auth } from '$lib/services';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { AddBoxLine } from 'svelte-remixicon';
</script>

<div>
    <div class="flex items-center border-b border-zinc-700 dark:border-white pb-1">
        <h3 class="text-2xl font-medium flex-1">Chapters</h3>
        {#if auth.checkProfile($content.content.author, $session.account)}
            <Button>
                <AddBoxLine class="button-icon" />
                <span class="button-text">Chapter</span>
            </Button>
        {/if}
    </div>
    <div class="w-full max-h-96 overflow-y-auto mb-6">
        {#if $content.sections.length === 0}
            <div class="empty">
                <h3>Nothing's been added yet!</h3>
                <p>
                    If you're the author, hit the Add Chapter button in this section to hit the
                    ground running!
                </p>
            </div>
        {:else}
            <ul>
                {#each $content.sections as section}
                    <li>
                        <a>{section.title}</a>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
