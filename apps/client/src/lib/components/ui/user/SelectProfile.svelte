<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { createForm } from 'felte';
    import { ProfileForm } from '$lib/models/accounts/forms';
    import {
        allProfiles$,
        setActiveProfile,
        createProfile,
        currAccount$,
    } from '$lib/repo/session.repo';
    import { AddBoxLine, CheckLine, CloseLine } from 'svelte-remixicon';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';

    let showAddForm = false;
    let submitting = false;
    const dispatch = createEventDispatcher();

    function setCurrProfile(id: string) {
        setActiveProfile(id);
        dispatch('profilesel');
    }

    const { form, errors } = createForm({
        onSubmit: (values) => {
            submitting = true;
            const formInfo: ProfileForm = {
                userTag: values.userTag.trim().split(' ').join(''),
                screenName: values.screenName,
                pronouns: [],
            };
            createProfile(formInfo).subscribe(
                () => {
                    submitting = false;
                    showAddForm = false;
                },
                (err) => {
                    submitting = false;
                    console.log(err);
                },
            );
        },
        validate: (values) => {
            const errors = {
                userTag: '',
                screenName: '',
                pronouns: '',
            };
            return errors;
        },
        onError: (errors) => {
            submitting = false;
        },
    });
</script>

<div class="w-11/12 mx-auto my-6">
    {#each $allProfiles$ as profile}
        <div
            class="profile-box border-zinc-600 dark:border-white"
            on:click={() => setCurrProfile(profile._id)}
        >
            <div
                class="avatar-container border-4 border-zinc-600 dark:border-white bg-zinc-800 dark:bg-white"
            >
                <img src={profile.profile.avatar} alt="avatar" />
            </div>
            <div class="user-info-container">
                <h3>{profile.screenName}</h3>
                <h5>@{profile.userTag}</h5>
            </div>
        </div>
    {/each}
    {#if $currAccount$.pseudonyms.length < 3}
        <div
            class="add-profile-box border-zinc-600 dark:border-white"
            class:auto-height={showAddForm}
        >
            {#if showAddForm}
                <form use:form>
                    <TextField
                        name="userTag"
                        type="text"
                        title="User Tag"
                        placeholder="ANewFace"
                        errorMessage={$errors.userTag}
                    />
                    <TextField
                        name="screenName"
                        type="text"
                        title="Display Name"
                        placeholder="A New Face"
                        errorMessage={$errors.screenName}
                    />
                    <div class="flex items-center justify-center">
                        <Button type="submit" loading={submitting} loadingText="Saving...">
                            <CheckLine class="button-icon" />
                            <span class="button-text">Submit</span>
                        </Button>
                        <div class="mx-0.5" />
                        <Button type="button" on:click={() => (showAddForm = false)}>
                            <CloseLine class="button-icon" />
                            <span class="button-text">Cancel</span>
                        </Button>
                    </div>
                </form>
            {:else}
                <div class="absolute w-full h-full" on:click={() => (showAddForm = !showAddForm)} />
                <AddBoxLine size="2rem" class="mr-2" />
                <span class="uppercase font-bold tracking-widest text-sm">Add profile</span>
            {/if}
        </div>
    {:else}
        <div class="empty">
            <h3 class="text-2xl">You've hit the limit!</h3>
            <p class="text-sm">Only three profiles per account, sorry folks!</p>
        </div>
    {/if}
</div>

<style lang="scss">
    div.profile-box {
        @apply relative border rounded-lg flex items-center p-2 transition transform cursor-pointer select-none mb-4;
        &:hover {
            @apply scale-105;
            background: var(--accent);

            div.avatar-container {
                @apply bg-white border-white;
            }

            div.user-info-container {
                h3,
                h5 {
                    @apply text-white;
                }
            }
        }

        &:active {
            @apply scale-100;
        }

        div.avatar-container {
            @apply rounded-full overflow-hidden mr-2;
            img {
                @apply h-16 w-16;
            }
        }

        div.user-info-container {
            h3 {
                @apply text-2xl font-medium;
            }

            h5 {
                @apply text-sm;
                color: var(--text-color);
            }
        }
    }

    div.add-profile-box {
        @apply relative border-2 rounded-lg flex items-center p-2 transition transform cursor-pointer select-none border-dashed justify-center;
        height: 90px;

        &.auto-height {
            @apply scale-100 cursor-default;
            height: auto;

            &:hover {
                @apply scale-100;
                color: var(--text-color);
                background: var(--background);
            }
        }

        &:hover {
            @apply scale-105 text-white;
            background: var(--accent);
        }

        &:active {
            @apply scale-100;
        }
    }
</style>
