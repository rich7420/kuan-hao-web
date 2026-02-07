import { Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects | Kuan-Hao',
    description: 'A showcase of my recent projects and experiments.',
};

const projects = [
    {
        title: 'Monorepo Portfolio',
        description: 'A high-performance personal website built with Next.js 15, Rust Axum, and Tailwind CSS.',
        github: 'https://github.com/rich/kuan-hao-web',
        demo: 'https://kuan-hao.dev', // Placeholder
        tags: ['Next.js', 'Rust', 'Tailwind CSS', 'Axum'],
    },
    {
        title: 'AI Agent Explorer',
        description: 'An experimental playground for exploring autonomous AI agents capabilities.',
        github: 'https://github.com/rich/ai-agent-explorer',
        demo: null,
        tags: ['Python', 'LangChain', 'OpenAI'],
    },
    {
        title: 'Real-time Chat App',
        description: 'A scalable chat application utilizing WebSockets and Redis for message distribution.',
        github: 'https://github.com/rich/chat-app',
        demo: 'https://chat.kuan-hao.dev',
        tags: ['Node.js', 'Socket.io', 'Redis', 'React'],
    },
];

export default function ProjectsPage() {
    return (
        <main className="min-h-screen bg-black text-white p-8 md:p-16">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Projects
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        A selection of projects that I've worked on recently. From web applications to AI experiments.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col"
                        >
                            <div className="p-6 space-y-4 flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <div className="flex gap-3 text-gray-400">
                                        <Link href={project.github} target="_blank" className="hover:text-white transition-colors">
                                            <Github className="w-5 h-5" />
                                        </Link>
                                        {project.demo && (
                                            <Link href={project.demo} target="_blank" className="hover:text-white transition-colors">
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300 border border-white/5"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
