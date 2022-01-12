import type { Profile } from '$lib/models/accounts';
import { getProfile } from '$lib/services/profile.service';
import type { Request } from '@sveltejs/kit';

export async function get({ params }: Request): Promise<{ status: number; body: Profile }> {
    const profileId: string = params.id;
    const profile: Profile = await getProfile(profileId).then((res) => {
        return res.data;
    });

    return {
        status: 200,
        body: profile,
    };
}
