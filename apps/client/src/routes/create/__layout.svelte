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
                props: {
                    title: `401 Forbidden`,
                    desc: `You do not have permission to view this page.`,
                },
            };
        }
    };
</script>

<slot />
