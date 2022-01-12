import type { Request } from '@sveltejs/kit';
import { fetchOne } from '$lib/services/content.service';
import type { Blog } from '$lib/models/content/blogs';

export async function get({ params }: Request): Promise<{ status: number; body: Blog }> {
    const blogId: string = params.id;
    const blog: Blog = await fetchOne(blogId).then((res) => {
        return res.content as Blog;
    });

    return {
        status: 200,
        body: blog,
    };
}
