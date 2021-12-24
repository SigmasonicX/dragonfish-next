<script lang="ts">
  import Select from "svelte-select";

  export let items;
  export let value;
  export let placeholder = 'Select items...';
  export let isClearable = false;
</script>

<Select {items} {value} {placeholder} {isClearable} on:select />
