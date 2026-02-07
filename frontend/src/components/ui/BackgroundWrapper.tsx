'use client';

import { useEffect, useState } from 'react';
import AuroraBackground from './AuroraBackground';
import ParticleNetwork from './ParticleNetwork';

const STORAGE_KEY = 'bg-mode';
type BgMode = 'aurora' | 'particles';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<BgMode>('aurora');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as BgMode | null;
        if (stored === 'aurora' || stored === 'particles') setMode(stored);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mounted, mode]);

    return (
        <>
            {mode === 'aurora' ? <AuroraBackground /> : <ParticleNetwork />}

            <div className="relative z-10">
                {children}
            </div>

            {/* Toggle: 極光 / 點線 - fixed bottom right */}
            <div
                className="fixed bottom-6 right-6 z-50 flex rounded-full bg-white/5 border border-white/10 p-1 backdrop-blur-sm"
                role="tablist"
                aria-label="Background"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'aurora'}
                    onClick={() => setMode('aurora')}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        mode === 'aurora'
                            ? 'bg-cyan-500/30 text-cyan-200'
                            : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                    Aurora
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'particles'}
                    onClick={() => setMode('particles')}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        mode === 'particles'
                            ? 'bg-cyan-500/30 text-cyan-200'
                            : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                    Particles
                </button>
            </div>
        </>
    );
}
