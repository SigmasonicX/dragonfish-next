<script lang='ts'>
  import Button from '$lib/components/ui/misc/Button.svelte';
  import Toggle from '$lib/components/forms/Toggle.svelte';
  import SelectMenu from "$lib/components/forms/SelectMenu.svelte";
  import { isOfAge$, setOfAge, setContentFilter, setTheme, theme$, setDarkMode, darkMode$ } from "$lib/repo/app.repo";
  import { ThemePref } from "$lib/models/site";

  let enableMature = false;
  let enableExplicit = false;
  let enableDarkMode = $darkMode$;

  const themes = Object.entries(ThemePref).map(([key, value]) => ({value: value, label: key}));
  let currTheme = themes.filter((theme) => { return theme.value === $theme$ })[0];

  $: {
    setContentFilter(enableMature, enableExplicit);
    setDarkMode(enableDarkMode);
  }

  function changeTheme(themePref: string): void {
    setTheme(ThemePref[themePref]);
  }
</script>

<div class='w-full flex-1'>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mx-auto my-6 w-11/12">
    <div class="p-2 border border-gray-600 dark:border-white rounded-md shadow-xl">
      <h3 class="text-xl font-medium text-center">Theme</h3>
      <span class='text-center text-sm italic w-full block'>Change Offprint's theme</span>
      <SelectMenu items={themes} value={currTheme} on:select={(event) => changeTheme(event.detail.label)} />
      <Toggle bind:value={enableDarkMode}>Dark Mode</Toggle>
    </div>
    <div class="p-2 border border-gray-600 dark:border-white rounded-md shadow-xl">
      <h3 class="text-xl font-medium text-center">Ratings Filter</h3>
      <span class='text-center text-sm italic w-full block'>Set what content you're willing to see</span>
      {#if $isOfAge$}
        <div class="flex flex-col items-center mt-4">
          <Toggle bind:value={enableMature}>Enable Mature</Toggle>
          <Toggle bind:value={enableExplicit}>Enable Explicit</Toggle>
          <div class="my-2"><!--spacer--></div>
        </div>
      {:else}
        <div class="flex flex-col items-center mt-4">
          <p class="text-sm text-center">Changing this setting may expose you to content not suitable for people under the age of 18.<br />Are you sure you want to proceed?</p>
          <Button on:click={setOfAge}>
            <span class="button-text">I'm old enough, I can take it</span>
          </Button>
        </div>
      {/if}
    </div>
    <div class='p-2 border border-gray-600 dark:border-white rounded-md shadow-xl'>
      <h3 class='text-xl font-medium text-center'>Card Size</h3>
      <span class='text-center text-sm italic w-full block'>Change the size of work cards on certain pages</span>
    </div>
  </div>
</div>