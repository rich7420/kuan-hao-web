import { getSortedPostsData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Calendar, User, Clock } from 'lucide-react';
import { Metadata } from 'next';

/** Remove duplicate title (H1) and author/read-time line from markdown body */
function stripDuplicateMeta(content: string, title: string): string {
    let trimmed = content.trimStart();
    const lines = trimmed.split('\n');
    const first = lines[0] ?? '';

    if (first === `# ${title}` || first === `# ${title.trim()}` || (first.match(/^#\s+(.+)$/) && first.replace(/^#\s+/, '').trim() === title.trim())) {
        trimmed = lines.slice(1).join('\n').trimStart();
    }
    const restLines = trimmed.split('\n');
    const nextLine = restLines[0] ?? '';
    if (nextLine.includes('·') && (nextLine.includes('read') || nextLine.includes('min'))) {
        trimmed = restLines.slice(1).join('\n').trimStart();
    }
    const hrMatch = trimmed.match(/^\s*---\s*\n?/);
    if (hrMatch) {
        trimmed = trimmed.slice(hrMatch[0].length).trimStart();
    }
    return trimmed;
}

// Generate static params for all posts
export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const posts = getSortedPostsData();
    const post = posts.find((p) => p.slug === resolvedParams.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Kuan-Hao`,
        description: post.excerpt || `Read ${post.title} on Kuan-Hao's blog.`,
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const posts = getSortedPostsData();
    const post = posts.find((p) => p.slug === resolvedParams.slug);

    if (!post) {
        notFound();
    }

    const bodyContent = stripDuplicateMeta(post.content, post.title);
    const dateFormatted = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const wordCount = bodyContent.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));

    return (
        <article className="min-h-screen bg-black text-gray-200 selection:bg-purple-500/30">
            <div className="w-full max-w-[min(90ch,96%)] sm:max-w-[min(85ch,92%)] lg:max-w-[min(80ch,1200px)] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-blue-400 mb-6 sm:mb-8 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform shrink-0" />
                    <span className="truncate">Back to Blog</span>
                </Link>

                <header className="mb-8 sm:mb-10 border-b border-white/10 pb-6 sm:pb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-3 sm:mb-4 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4 shrink-0" />
                            Kuan-Hao Huang
                        </span>
                        <time dateTime={post.date} className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 shrink-0" />
                            {dateFormatted}
                        </time>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 shrink-0" />
                            {readTime} min read
                        </span>
                    </div>
                </header>

                <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-400 prose-img:rounded-xl prose-img:max-w-full prose-pre:overflow-x-auto prose-blockquote:border-l-blue-500/50 prose-blockquote:not-italic post-content">
                    <ReactMarkdown>{bodyContent}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
}

