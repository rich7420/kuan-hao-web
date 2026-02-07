import { MetadataRoute } from 'next';

const BASE_URL = 'https://kuan-hao.dev'; // Replace with your actual domain

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
