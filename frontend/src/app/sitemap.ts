import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';

const BASE_URL = 'https://kuan-hao.dev'; // Replace with your actual domain

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getSortedPostsData();

    const blogPosts = posts.map((post) => ({
        url: `${BASE_URL}/posts/${post.slug}`,
        lastModified: post.date,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const routes = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 1,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
    ];

    return [...routes, ...blogPosts];
}
