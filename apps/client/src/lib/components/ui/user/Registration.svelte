<script lang="ts">
  import { createForm } from "felte";
  import { LoginCircleLine } from 'svelte-remixicon';
  import TextField from "$lib/components/forms/TextField.svelte";
  import Button from "$lib/components/ui/misc/Button.svelte";

  const { form } = createForm({
    onSubmit: (values) => {
      console.log(`Default onSubmit`);
      console.log(values);
    },
  });
</script>

<form use:form>
  <TextField name="email" type="email" />
  <TextField name="password" type="password" />
  <Button type="submit">
    <LoginCircleLine class="button-icon" />
    <span class="button-text">Submit</span>
  </Button>
</form>