'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

import MotionCard from '../ui/MotionCard';

const GITHUB_URL = 'https://github.com/rich7420';
const LINKEDIN_URL = 'https://www.linkedin.com/in/kuan-hao-h/';

export default function BioBlock() {
    return (
        <MotionCard delay={0.1}>
            <div className="bg-white/10 dark:bg-neutral-900/40 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-3xl p-8 h-full flex flex-col justify-center relative overflow-hidden group">
                {/* Subtle Gradient Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                    Hi, I&apos;m Kuan-Hao.
                </h2>
                <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-200 dark:group-hover:text-gray-100 text-lg leading-relaxed relative z-10 transition-colors duration-300">
                    I&apos;m an Apache Mahout Committer and open-source enthusiast specializing in AI Infrastructure and Distributed Systems. My passion lies in building scalable, high-performance tools for the cloud-native ecosystem. Currently conducting research and actively preparing for my PhD application.
                </p>
                <div className="flex items-center gap-4 mt-4 relative z-10">
                    <Link
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-cyan-400 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="w-6 h-6" />
                    </Link>
                    <Link
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-cyan-400 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </MotionCard>
    );
}
