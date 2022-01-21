<script lang="ts">
    import { fly } from 'svelte/transition';
    import { abbreviate, pluralize, localeDate } from '$lib/util';
    import { content } from '$lib/repo/content.repo';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import WorkBanner from '$lib/components/ui/content/WorkBanner.svelte';
    import {
        AddBoxLine,
        FlagLine,
        ShareBoxLine,
        ArrowDownSLine,
        ArrowUpSLine,
    } from 'svelte-remixicon';

    let showDesc = true;
</script>

<div class="w-full h-screen overflow-y-auto">
    <WorkBanner content={$content.content} />
    <div class="w-11/12 mx-auto md:max-w-4xl">
        <div
            class="flex flex-col w-full rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed mb-6"
        >
            <div class="flex items-center p-2 border-b-2 border-zinc-500">
                <Button>
                    <AddBoxLine class="button-icon" />
                    <span class="button-text">Add To Library</span>
                </Button>
                <div class="mx-0.5"><!--separator--></div>
                <Button>
                    <ShareBoxLine class="button-icon" />
                    <span class="button-text">Share</span>
                </Button>
                <div class="flex-1"><!--separator--></div>
                <Button>
                    <FlagLine class="button-icon" />
                    <span class="button-text">Report</span>
                </Button>
            </div>
            <div class="flex items-center justify-center">
                <div class="stat-box border-r-2 border-zinc-500">
                    {#if $content.content.audit.publishedOn}
                        <span class="text text-zinc-500 dark:text-zinc-400">Published</span>
                        <span class="stat">
                            {localeDate($content.content.audit.publishedOn, 'mediumDate')}
                        </span>
                    {:else}
                        <span class="text text-zinc-500 dark:text-zinc-400">Created</span>
                        <span class="stat">
                            {localeDate($content.content.createdAt, 'mediumDate')}
                        </span>
                    {/if}
                </div>
                <div class="stat-box border-r-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        View{pluralize($content.content.stats.views)}
                    </span>
                    <span class="stat">{abbreviate($content.content.stats.views)}</span>
                </div>
                <div class="stat-box border-r-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        Word{pluralize($content.content.stats.words)}
                    </span>
                    <span class="stat">{abbreviate($content.content.stats.words)}</span>
                </div>
                <div class="stat-box border-r-2 border-zinc-500">
                    <span class="text text-zinc-500 dark:text-zinc-400">
                        Comment{pluralize($content.content.stats.comments)}
                    </span>
                    <span class="stat">{abbreviate($content.content.stats.comments)}</span>
                </div>
                <div class="stat-box">
                    <span class="text text-zinc-500 dark:text-zinc-400">Status</span>
                    <span class="stat">{$content.content.meta.status}</span>
                </div>
            </div>
        </div>
        <div>
            <div class="w-full border-b border-zinc-700 dark:border-white flex items-center">
                <h3 class="text-2xl font-medium flex-1">Description</h3>
                <Button on:click={() => (showDesc = !showDesc)}>
                    {#if showDesc}
                        <ArrowUpSLine class="button-icon no-text" />
                    {:else}
                        <ArrowDownSLine class="button-icon no-text" />
                    {/if}
                </Button>
            </div>
            {#if showDesc}
                <div
                    class="html-description"
                    transition:fly|local={{ delay: 0, duration: 150, y: -10 }}
                >
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Aenean vel elit
                        scelerisque mauris pellentesque pulvinar. Enim facilisis gravida neque
                        convallis a cras semper. Congue mauris rhoncus aenean vel elit scelerisque.
                        Felis bibendum ut tristique et egestas. Proin sagittis nisl rhoncus mattis
                        rhoncus. Tincidunt ornare massa eget egestas. Nibh mauris cursus mattis
                        molestie a. Nam libero justo laoreet sit amet cursus sit. Varius morbi enim
                        nunc faucibus. Eu facilisis sed odio morbi quis commodo odio aenean.
                        Bibendum ut tristique et egestas quis ipsum. Praesent semper feugiat nibh
                        sed pulvinar. Phasellus faucibus scelerisque eleifend donec pretium.
                        Faucibus et molestie ac feugiat sed lectus. In massa tempor nec feugiat nisl
                        pretium fusce. Vitae aliquet nec ullamcorper sit amet risus nullam. Sapien
                        faucibus et molestie ac feugiat sed lectus.
                    </p>

                    <p>
                        Id porta nibh venenatis cras sed felis eget. Elementum facilisis leo vel
                        fringilla est ullamcorper eget. Rutrum tellus pellentesque eu tincidunt
                        tortor aliquam nulla facilisi cras. Curabitur vitae nunc sed velit dignissim
                        sodales ut eu sem. Nec feugiat nisl pretium fusce id velit ut tortor. Leo
                        vel orci porta non pulvinar neque laoreet suspendisse. Aliquet lectus proin
                        nibh nisl condimentum id. A diam maecenas sed enim ut sem viverra aliquet
                        eget. Eu ultrices vitae auctor eu. Augue lacus viverra vitae congue. Libero
                        justo laoreet sit amet cursus sit amet dictum sit. Eget sit amet tellus cras
                        adipiscing enim eu. Egestas maecenas pharetra convallis posuere morbi leo
                        urna molestie at. Turpis nunc eget lorem dolor sed viverra. Massa tempor nec
                        feugiat nisl pretium fusce id velit ut. Iaculis at erat pellentesque
                        adipiscing commodo elit at. Vitae congue eu consequat ac felis donec et
                        odio.
                    </p>
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    div.stat-box {
        @apply flex flex-col items-center justify-center w-[8rem] h-[5rem];
        span.text {
            @apply font-semibold uppercase mb-2 text-xs tracking-widest;
        }
        span.stat {
            @apply md:text-base text-sm font-serif;
        }
    }
</style>
