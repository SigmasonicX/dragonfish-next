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

<div class='jumbotron'>
  <div class='big-box'>
    {#if activeSlide === Slides.First }
      <img src='/images/nightrunning.png' alt='night running' transition:slide|local="{{delay: 0, duration: 300, easing: quintOut}}">
      <div class='box-info'>
        <h1 class='text-5xl text-white font-medium'>Last Week on Offprint</h1>
        <h2 class='text-3xl text-white'>The one about Offprint Next</h2>
      </div>
    {:else if activeSlide === Slides.Second}
      <img src='/images/highqueen.jpg' alt='high queen' transition:slide|local="{{delay: 0, duration: 300, easing: quintOut}}">
      <div class='box-info'>
        <h1 class='text-5xl text-white font-medium'>Animorphs Writing Contest!</h1>
        <h2 class='text-3xl text-white'>'Tis the season for classics</h2>
      </div>
    {:else if activeSlide === Slides.Third}
      <img src='/images/berserker.jpg' alt='berserker' transition:slide|local="{{delay: 0, duration: 300, easing: quintOut}}">
      <div class='box-info'>
        <h1 class='text-5xl text-white font-medium'>DevBlog #2: Pain Is Process</h1>
        <h2 class='text-3xl text-white'>Baby steps</h2>
      </div>
    {:else if activeSlide === Slides.Fourth}
      <img src='/images/cityscape.jpg' alt='cityscape' transition:slide|local="{{delay: 0, duration: 300, easing: quintOut}}">
      <div class='box-info'>
        <h1 class='text-5xl text-white font-medium'>Interview: bats and the process of coping with no firm Owl House release date</h1>
        <h2 class='text-3xl text-white'>And what a pain it is</h2>
      </div>
    {/if}
  </div>
  <div class='card-stack'>
    <div class='card' class:active={activeSlide === Slides.First} on:click={() => activeSlide = Slides.First}>
      <div class='flex-1 truncate'>
        <h3 class='text-2xl font-medium w-full truncate'>Last Week on Offprint</h3>
        <div class='flex items-center text-sm'>
          <span>by Figments</span>
          <span class='mx-1'>•</span>
          <span>Wed, Nov. 29, 2021</span>
        </div>
      </div>
      <img src='/images/demoavatar.png' alt='demo avatar' class='w-16 h-16 rounded-md'>
    </div>
    <div class='card' class:active={activeSlide === Slides.Second} on:click={() => activeSlide = Slides.Second}>
      <div class='flex-1 truncate'>
        <h3 class='text-2xl font-medium w-full truncate'>Animorphs Writing Contest!</h3>
        <div class='flex items-center text-sm'>
          <span>by Figments</span>
          <span class='mx-1'>•</span>
          <span>Wed, Nov. 29, 2021</span>
        </div>
      </div>
      <img src='/images/demoavatar.png' alt='demo avatar' class='w-16 h-16 rounded-md'>
    </div>
    <div class='card' class:active={activeSlide === Slides.Third} on:click={() => activeSlide = Slides.Third}>
      <div class='flex-1 truncate'>
        <h3 class='text-2xl font-medium w-full truncate'>DevBlog #2: Pain Is Process</h3>
        <div class='flex items-center text-sm'>
          <span>by Figments</span>
          <span class='mx-1'>•</span>
          <span>Wed, Nov. 29, 2021</span>
        </div>
      </div>
      <img src='/images/demoavatar.png' alt='demo avatar' class='w-16 h-16 rounded-md'>
    </div>
    <div class='card' class:active={activeSlide === Slides.Fourth} on:click={() => activeSlide = Slides.Fourth}>
      <div class='flex-1 truncate'>
        <h3 class='text-2xl font-medium w-full truncate'>Interview: bats and the process of coping with no firm Owl House release date</h3>
        <div class='flex items-center text-sm'>
          <span>by Figments</span>
          <span class='mx-1'>•</span>
          <span>Wed, Nov. 29, 2021</span>
        </div>
      </div>
      <img src='/images/demoavatar.png' alt='demo avatar' class='w-16 h-16 rounded-md'>
    </div>
  </div>
</div>

<style lang='scss'>
  div.jumbotron {
    @apply w-full h-full flex relative;
    div.big-box {
      @apply w-2/3 relative overflow-hidden;
      img {
        @apply object-cover h-full w-full;
      }
      div.box-info {
        @apply absolute bottom-6 left-6;
      }
    }
    div.card-stack {
      @apply w-1/3 flex flex-col;
      div.card {
        @apply border-l-8 border-b border-gray-300 w-full h-1/4 flex items-center p-4 cursor-pointer;
        &:last-child {
          @apply border-b-0;
        }
        &.active {
          @apply bg-gray-100;
          border-color: var(--accent);
        }
      }
    }
  }
</style>