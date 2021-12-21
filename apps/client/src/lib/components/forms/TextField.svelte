<script lang="ts">
  export let name = 'text';
  export let type = 'text';
  export let title = 'Text Input';
  export let placeholder = 'Text Input';
</script>

<div class="text-field">
  <label for={name} class="text-[0.625rem] relative top-0.5 left-2 py-0.5 px-1 bg-gray-200 rounded-t-lg font-semibold tracking-wider uppercase">{title}</label>
  <input
    id={name}
    {type}
    {name}
    {title}
    {placeholder}
    on:change
  >
</div>

<style lang="scss">
  div.text-field {
    @apply w-full my-2;
    input {
      @apply w-full rounded-lg px-3 pt-3 pb-2.5 border-0 bg-gray-200 transition;
      border-bottom: 2px solid transparent;
      &:focus {
        @apply ring-0 shadow-md;
        border-bottom: 2px solid var(--borders);
      }
    }
  }
</style>