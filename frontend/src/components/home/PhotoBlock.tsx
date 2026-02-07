'use client';

import React from 'react';
import Image from 'next/image';

import MotionCard from '../ui/MotionCard';

export default function PhotoBlock() {
    return (
        <MotionCard delay={0}>
            <div className="bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-3xl p-6 h-full flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Photo container */}
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-white/10 overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-105">
                    <Image
                        src="/photo.jpg"
                        alt="Kuan-Hao Huang"
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>

                <p className="text-sm text-[#D0D0D0] text-center relative z-10 font-medium">
                    Kuan-Hao Huang
                </p>
            </div>
        </MotionCard>
    );
}
