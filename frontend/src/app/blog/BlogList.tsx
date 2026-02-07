'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, ChevronLeft } from 'lucide-react';
import { Post } from '@/lib/posts';

interface BlogListProps {
    initialPosts: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState(initialPosts);

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-cyan-400 mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                        Blog
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Thoughts on software engineering, AI, and design.
                    </p>
                </div>

                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white/10 transition-colors sm:text-sm"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            <div className="space-y-6">
                <AnimatePresence>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/posts/${post.slug}`}
                                    className="group block p-6 rounded-2xl bg-white/5 dark:bg-neutral-900/60 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-semibold text-[#F0F0F0] group-hover:text-cyan-300 transition-colors">
                                            {post.title}
                                        </h2>
                                        <span className="text-xs font-mono text-gray-500 flex items-center bg-white/5 px-2 py-1 rounded-md">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {post.date}
                                        </span>
                                    </div>
                                    <p className="text-[#C8C8C8] leading-relaxed mb-4">
                                        {post.excerpt || "Click to read more..."}
                                    </p>
                                    <div className="text-sm text-cyan-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                                        Read Article <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 text-gray-500"
                        >
                            No posts found matching &quot;{searchQuery}&quot;.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
