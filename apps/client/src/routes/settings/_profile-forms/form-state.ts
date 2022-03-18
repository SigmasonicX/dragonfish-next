import { writable } from 'svelte/store';
import type { Profile } from '$lib/models/accounts';

interface ProfileSettings {
    profiles: Profile[];
    currProfile: Profile;
}

export const profileSettings = writable<ProfileSettings>({
    profiles: null,
    currProfile: null,
});

export function setProfileSettings(profiles: Profile[]): void {
    profileSettings.set({
        profiles,
        currProfile: null,
    });
}

export function setCurrProfile(profileId: string): void {
    console.log(`setting profile with ID: ${profileId}`);
    profileSettings.update((state) => {
        if (
            state.currProfile !== null &&
            state.currProfile !== undefined &&
            state.currProfile._id === profileId
        ) {
            state.currProfile = null;
        } else {
            state.currProfile = state.profiles.find((profile) => profile._id === profileId);
        }
        return state;
    });
}
