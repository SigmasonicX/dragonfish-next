<script lang="ts">
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    enum Slides {
        First,
        Second,
        Third,
        Fourth,
    }
    let activeSlide: Slides = Slides.First;
</script>

<div class="jumbotron">
    <div class="big-box">
        {#if activeSlide === Slides.First}
            <img
                src="/images/nightrunning.png"
                alt="night running"
                transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
            />
            <div class="box-info">
                <h1>Last Week on Offprint</h1>
                <h2>The one about Offprint Next</h2>
            </div>
        {:else if activeSlide === Slides.Second}
            <img
                src="/images/highqueen.jpg"
                alt="high queen"
                transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
            />
            <div class="box-info">
                <h1>Animorphs Writing Contest!</h1>
                <h2>'Tis the season for classics</h2>
            </div>
        {:else if activeSlide === Slides.Third}
            <img
                src="/images/berserker.jpg"
                alt="berserker"
                transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
            />
            <div class="box-info">
                <h1>DevBlog #2: Pain Is Process</h1>
                <h2>Baby steps</h2>
            </div>
        {:else if activeSlide === Slides.Fourth}
            <img
                src="/images/cityscape.jpg"
                alt="cityscape"
                transition:slide|local={{ delay: 0, duration: 300, easing: quintOut }}
            />
            <div class="box-info">
                <h1>
                    Interview: bats and the process of coping with no firm Owl House release date
                </h1>
                <h2>And what a pain it is</h2>
            </div>
        {/if}
    </div>
    <div class="card-stack">
        <div
            class="card"
            class:active={activeSlide === Slides.First}
            on:click={() => (activeSlide = Slides.First)}
        >
            <div class="flex-1 truncate">
                <h3>Last Week on Offprint</h3>
                <div class="flex items-center">
                    <span class="hidden text-sm md:text-base md:block">by Figments</span>
                    <span class="hidden md:block mx-1">•</span>
                    <span class="text-sm md:text-base">Wed, Nov. 29, 2021</span>
                </div>
            </div>
            <img src="/images/demoavatar.png" alt="demo avatar" />
        </div>
        <div
            class="card"
            class:active={activeSlide === Slides.Second}
            on:click={() => (activeSlide = Slides.Second)}
        >
            <div class="flex-1 truncate">
                <h3>Animorphs Writing Contest!</h3>
                <div class="flex items-center">
                    <span class="hidden text-sm md:text-base md:block">by Figments</span>
                    <span class="hidden md:block mx-1">•</span>
                    <span class="text-sm md:text-base">Wed, Nov. 29, 2021</span>
                </div>
            </div>
            <img src="/images/demoavatar.png" alt="demo avatar" />
        </div>
        <div
            class="card"
            class:active={activeSlide === Slides.Third}
            on:click={() => (activeSlide = Slides.Third)}
        >
            <div class="flex-1 truncate">
                <h3>DevBlog #2: Pain Is Process</h3>
                <div class="flex items-center">
                    <span class="hidden text-sm md:text-base md:block">by Figments</span>
                    <span class="hidden md:block mx-1">•</span>
                    <span class="text-sm md:text-base">Wed, Nov. 29, 2021</span>
                </div>
            </div>
            <img src="/images/demoavatar.png" alt="demo avatar" />
        </div>
        <div
            class="card"
            class:active={activeSlide === Slides.Fourth}
            on:click={() => (activeSlide = Slides.Fourth)}
        >
            <div class="flex-1 truncate">
                <h3>
                    Interview: bats and the process of coping with no firm Owl House release date
                </h3>
                <div class="flex items-center">
                    <span class="hidden text-sm md:text-base md:block">by Figments</span>
                    <span class="hidden md:block mx-1">•</span>
                    <span class="text-sm md:text-base">Wed, Nov. 29, 2021</span>
                </div>
            </div>
            <img src="/images/demoavatar.png" alt="demo avatar" />
        </div>
    </div>
</div>

<style lang="scss">
    div.jumbotron {
        @apply w-full h-full flex flex-col md:flex-row relative;
        div.big-box {
            @apply w-full md:w-2/3 relative overflow-hidden;
            img {
                @apply object-cover h-full w-full;
            }
            div.box-info {
                @apply absolute bottom-6 left-6;
                h1 {
                    @apply text-3xl md:text-5xl text-white font-medium;
                }
                h2 {
                    @apply text-xl md:text-3xl text-white;
                }
            }
        }
        div.card-stack {
            @apply w-full md:w-1/3 flex overflow-x-auto md:flex-col;
            div.card {
                @apply border-t-8 border-r md:border-r-0 md:border-t-0 md:border-l-8 md:border-b border-zinc-300 dark:border-zinc-600 min-w-[280px] max-w-[280px] md:max-w-full md:min-w-full md:w-full md:h-1/4 flex items-center p-4 cursor-pointer;
                &:last-child {
                    @apply border-b-0 border-r-0;
                }
                &.active {
                    @apply bg-zinc-200 dark:bg-zinc-700;
                    border-color: var(--accent);
                }
                h3 {
                    @apply text-lg md:text-2xl font-medium w-full truncate;
                }
                img {
                    @apply w-16 h-16 rounded-md hidden md:block;
                }
            }
        }
    }
</style>
