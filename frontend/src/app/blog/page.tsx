
import { getSortedPostsData } from '@/lib/posts';
import BlogList from './BlogList';

export const metadata = {
    title: 'Blog | Kuan-Hao',
    description: 'Writings on technology, design, and AI.',
};

export default function Blog() {
    const allPosts = getSortedPostsData();
    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <BlogList initialPosts={allPosts} />
        </main>
    );
}
