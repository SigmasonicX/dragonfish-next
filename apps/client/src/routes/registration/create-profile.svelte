<script lang="ts">
  // TODO: implement create profile functionality

  import { createForm } from "felte";
  import TextField from "$lib/components/forms/TextField.svelte";
  import Button from "$lib/components/ui/misc/Button.svelte";
  import { Save2Line } from 'svelte-remixicon';

  let submitting = false;

  const { form, errors } = createForm({
    onSubmit: (values) => {
      submitting = true;
      console.log(values);
    },
    validate: (values) => {
      const errors = {
        userTag: '',
        screenName: '',
        pronouns: ''
      };
      if (!values.userTag || values.userTag > 16 || values.userTag < 3) {
        errors.userTag = `User tags must be greater than 3 and no more than 16 characters long.`;
      }
      if (!values.screenName || values.screenName > 32 || values.screenName < 3) {
        errors.screenName = `Screen names must be greater than 3 and no more than 32 characters long.`;
      }
      return errors;
    }
  })
</script>

<div class="h-full w-full flex flex-col items-center justify-center p-4 h-96">
  <h2 class="text-3xl font-medium">Create Profile</h2>
  <div class="my-1"></div>
  <form use:form>
    <TextField
      name="screenName"
      type="text"
      title="Screen Name"
      placeholder="A Brand New Me"
      errorMessage={$errors.screenName}
    />
    <TextField
      name="userTag"
      type="text"
      title="Username"
      placeholder="ABrandNewMe"
      errorMessage={$errors.userTag}
    />
    <Button type="submit" loading={submitting} loadingText="Saving...">
      <Save2Line class="button-icon" />
      <span class="button-text">Save</span>
    </Button>
  </form>
</div>