'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import MotionCard from '../ui/MotionCard';

const ICON_COLOR = '22d3ee'; // cyan-400
const technologies = [
    { name: 'Java', slug: 'openjdk' },
    { name: 'Python', slug: 'python' },
    { name: 'Rust', slug: 'rust' },
    { name: 'CUDA', slug: 'nvidia' },
    { name: 'Docker', slug: 'docker' },
    { name: 'Kubernetes', slug: 'kubernetes' },
    { name: 'Distributed', slug: 'apachekafka' },
    { name: 'Open source', slug: 'apache' },
] as const;

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function TechStackBlock() {
    return (
        <MotionCard delay={0.3}>
            <div className="bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-3xl p-6 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    Tech Stack
                </h3>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow"
                >
                    {technologies.map((tech) => (
                        <motion.div
                            key={tech.name}
                            variants={item}
                            initial={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer border border-white/10"
                        >
                            <div className="mb-2 flex items-center justify-center">
                                <img
                                    src={`https://cdn.simpleicons.org/${tech.slug}/${ICON_COLOR}`}
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                            <span className="text-xs font-medium text-center text-[#D0D0D0]">
                                {tech.name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </MotionCard>
    );
}
