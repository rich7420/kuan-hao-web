
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSortedPostsData } from '@/lib/posts';
import { LatestArticlesList } from './LatestArticlesList';

export default async function LatestArticlesBlock() {
    const posts = getSortedPostsData();
    const latestPosts = posts.slice(0, 3);

    return (
        <LatestArticlesList posts={latestPosts} />
    );
}
