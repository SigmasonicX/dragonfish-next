<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import type { Blog } from '$lib/models/content/blogs';
    import { setContent } from '$lib/repo/content.repo';

    export const load: Load = async ({ params, fetch }) => {
        const blogId: string = params.id;
        const blog: Blog = await fetch(`/api/blog/${blogId}`).then(async (res) => {
            return await res.json();
        });

        setContent(blog);

        return {
            props: {
                blog,
            },
        };
    };
</script>

<slot />
