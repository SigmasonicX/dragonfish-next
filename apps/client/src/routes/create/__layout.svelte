<script context="module" lang="ts">
    import { isLoggedIn } from '$lib/repo/session.repo';
    import type { Load } from '@sveltejs/kit';

    export const load: Load = async () => {
        if (isLoggedIn()) {
            return {
                status: 200,
            };
        } else {
            return {
                status: 401,
            };
        }
    };
</script>

<slot />
