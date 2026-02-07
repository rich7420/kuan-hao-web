'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// Since this is a client component for animation, we receive posts as props
// or we fetch them differently. For simplicity in this structure, we'll
// make a wrapper or just pass data.
// Wait, LatestArticlesBlock was async. We can't make async component 'use client'.
// Strategy: Keep LatestArticlesBlock as server component, make a Client Child for the list.

import MotionCard from '../ui/MotionCard';

interface Post {
    slug: string;
    title: string;
    date: string;
    excerpt?: string;
}

interface LatestArticlesListProps {
    posts: Post[];
}

export function LatestArticlesList({ posts }: LatestArticlesListProps) {
    return (
        <MotionCard delay={0.2}>
            <div className="bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-3xl p-6 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-[#F0F0F0] flex items-center justify-between">
                    Latest Articles
                    <Link
                        href="/blog"
                        className="text-sm font-normal text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                        onClick={(e) => {
                            if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                window.dispatchEvent(new CustomEvent("open-dashboard"));
                            }
                        }}
                    >
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </h3>

                <div className="flex flex-col gap-4 flex-grow">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index + 0.3, duration: 0.4 }}
                            >
                                <Link
                                    href={`/posts/${post.slug}`}
                                    className="group block p-4 -mx-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                >
                                    <h4 className="font-medium text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
                                        {post.title}
                                    </h4>
                                    <p className="text-sm text-[#C0C0C0] line-clamp-2 mb-2">
                                        {post.excerpt || "No excerpt available."}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {post.date}
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                            <p>No posts found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </MotionCard>
    );
}
