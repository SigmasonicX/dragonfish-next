<script lang="ts">
  import { slogans } from '$lib/models/site';
  import Jumbotron from '$lib/components/ui/misc/Jumbotron.svelte';

  const currSlogan = slogans[Math.floor(Math.random() * slogans.length)];
</script>

<svelte:head>
  <title>Home &mdash; Offprint</title>
  <!-- Primary Meta Tags -->
  <meta name="title" content="Offprint Next">
  <meta name="description" content="Catch a glimpse at the future of Offprint">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://next.offprint.net/">
  <meta property="og:title" content="Offprint Next">
  <meta property="og:description" content="Catch a glimpse at the future of Offprint">
  <meta property="og:image" content="/images/offprint_icon.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://next.offprint.net/">
  <meta property="twitter:title" content="Offprint Next">
  <meta property="twitter:description" content="Catch a glimpse at the future of Offprint">
  <meta property="twitter:image" content="/images/offprint_icon.png">
</svelte:head>

<div class='w-full h-screen overflow-y-auto'>
  <div class='w-full mb-6'>
    <div class='home-header'>
      <img src='/images/logo.png' alt='logo' style='max-width: 24rem; margin: 0 auto;' class='relative z-30'>
      <h2 class='text-white text-2xl relative z-30'>{currSlogan}</h2>
    </div>
    <div class='jumbo-carousel'>
      <Jumbotron />
    </div>
  </div>
  <div class='w-9/12 mx-auto my-6'>
    <div class='w-full border border-gray-600 rounded-md p-4 flex items-center'>
      <img src='/images/democover.jpg' alt='demo cover' style='max-width: 4rem;' class='object-contain rounded-md'>
      <div class='flex-1 w-full px-4'>
        <h3 class='text-xl font-medium'>A Lost Little Sponge</h3>
        <h4 class='text-base mb-2.5'>by UndertalesWriteMan</h4>
        <div class='w-full h-2 rounded-md bg-gray-300'>
          <div class='w-8/12 h-full rounded-md' style='background: var(--accent)'></div>
        </div>
      </div>
      <a href='/'>Continue Reading >></a>
    </div>
  </div>
  <div class='w-9/12 mx-auto my-6 flex'>
    <div class='flex-1'>
      here be dragons
    </div>
    <div class='w-72 ml-4'>
      <h3 class='text-2xl font-medium w-full border-b border-gray-600 mb-4'>News & Updates</h3>
      <div class='w-full border border-gray-600 rounded-md p-2 flex items-center'>
        <img src='/images/demoavatar.png' alt='demo avatar' style='max-width: 2.5rem'>
        <div class='truncate flex-1 w-full ml-2'>
          <h4 class='text-lg font-medium top-1'>Last Week on Offprint</h4>
          <div class='relative -top-1 flex items-center'>
            <span class='text-xs'>by Figments</span>
            <span class='text-xs mx-0.5'>•</span>
            <span class='text-xs'>Wed, Nov. 29, 2021</span>
          </div>
        </div>
      </div>
      <div class='my-2'></div>
      <div class='w-full border border-gray-600 rounded-md p-2 flex items-center'>
        <img src='/images/demoavatar.png' alt='demo avatar' style='max-width: 2.5rem'>
        <div class='truncate flex-1 w-full ml-2'>
          <h4 class='text-lg font-medium top-1 truncate'>Animorphs Writing Contest!</h4>
          <div class='relative -top-1 flex items-center'>
            <span class='text-xs'>by SigmasonicX</span>
            <span class='text-xs mx-0.5'>•</span>
            <span class='text-xs'>Wed, Nov. 29, 2021</span>
          </div>
        </div>
      </div>
      <div class='my-2'></div>
      <div class='w-full border border-gray-600 rounded-md p-2 flex items-center'>
        <img src='/images/demoavatar.png' alt='demo avatar' style='max-width: 2.5rem'>
        <div class='truncate flex-1 w-full ml-2'>
          <h4 class='text-lg font-medium top-1 truncate'>DevBlog #2: Pain Is Process</h4>
          <div class='relative -top-1 flex items-center'>
            <span class='text-xs'>by Figments</span>
            <span class='text-xs mx-0.5'>•</span>
            <span class='text-xs'>Wed, Nov. 29, 2021</span>
          </div>
        </div>
      </div>
      <div class='my-2'></div>
      <div class='w-full border border-gray-600 rounded-md p-2 flex items-center'>
        <img src='/images/demoavatar.png' alt='demo avatar' style='max-width: 2.5rem'>
        <div class='truncate flex-1 w-full ml-2'>
          <h4 class='text-lg font-medium top-1 truncate'>Interview: bats and the process of coping with no firm Owl House release date</h4>
          <div class='relative -top-1 flex items-center'>
            <span class='text-xs'>by Dash</span>
            <span class='text-xs mx-0.5'>•</span>
            <span class='text-xs'>Wed, Nov. 29, 2021</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang='scss'>
  div.home-header {
    @apply text-white text-center py-2 w-full flex flex-col items-center justify-center;
    background: var(--accent);
  }
  div.jumbo-carousel {
    @apply shadow-2xl mb-8;
    height: 32rem;
  }
  :global(span.dot) {
    border-color: white !important;
    &.is-active {
      background-color: white !important;
    }
  }
  :global(.swipe-indicator .is-active) {
    background-color: white !important;
  }
</style>