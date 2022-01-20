<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import type { Blog } from '$lib/models/content/blogs';
    import { setContent } from '$lib/repo/content.repo';
    import { getPage } from '$lib/repo/comments.repo';
    import { CommentKind } from '$lib/models/comments';

    export const load: Load = async ({ params, fetch, url }) => {
        const blogId: string = params.id;
        const blog: Blog = await fetch(`/api/blog/${blogId}`).then(async (res) => {
            return await res.json();
        });

        const page: number = url.searchParams.has('page') ? +url.searchParams.get('page') : 1;

        setContent(blog);

        return {
            props: {
                blog,
                comments: await getPage(blog._id, CommentKind.ContentComment, page),
            },
        };
    };
</script>

<slot />
