<script lang="ts">
  export let name = 'text';
  export let type = 'text';
</script>

<div class="text-field">
  <input {type} {name} on:change>
</div>

<style lang="scss">
  div.text-field {

  }
</style>