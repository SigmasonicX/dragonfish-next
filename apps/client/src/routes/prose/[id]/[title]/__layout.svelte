<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit';
    import { CommentKind } from '$lib/models/comments';
    import { fetchOne } from '$lib/services/content.service';
    import { setContent } from '$lib/repo/content.repo';
    import { getPage } from '$lib/repo/comments.repo';

    export const load: Load = async ({ params, url }) => {
        const proseId: string = params.id;
        const page: number = url.searchParams.has('page') ? +url.searchParams.get('page') : 1;
        const prose = await fetchOne(proseId);

        setContent(prose.content, prose.content.sections, prose.ratings, prose.libraryDoc);

        return {
            props: {
                content: prose.content,
                comments: await getPage(prose.content._id, CommentKind.ContentComment, page),
            },
        };
    };
</script>

<script lang="ts">
    import type { Content } from '$lib/models/content';
    import WorkBanner from '$lib/components/ui/content/WorkBanner.svelte';

    export let content: Content;
</script>

<div class="w-full h-screen overflow-y-auto">
    <WorkBanner {content} />

    <slot />
</div>
