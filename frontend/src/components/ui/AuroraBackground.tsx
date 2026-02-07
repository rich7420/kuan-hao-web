'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Aurora-style mesh gradient background — slow orbs + cursor-following spotlight.
 */
export default function AuroraBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 28, stiffness: 400 });
    const springY = useSpring(mouseY, { damping: 28, stiffness: 400 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 1 }}
            aria-hidden
        >
            <div className="absolute inset-0 bg-[#0A0E27]" />

            {/* Aurora orbs - slow drift */}
            <motion.div
                className="absolute w-[80vmax] h-[80vmax] rounded-full opacity-[0.35] mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(6, 182, 212, 0.4) 0%, transparent 50%)',
                    left: '-20vmax',
                    top: '-20vmax',
                }}
                animate={{
                    x: [0, 80, 40, 0],
                    y: [0, 40, 80, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="absolute w-[70vmax] h-[70vmax] rounded-full opacity-[0.3] mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at 70% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)',
                    right: '-15vmax',
                    bottom: '-15vmax',
                }}
                animate={{
                    x: [0, -60, -30, 0],
                    y: [0, -40, -70, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="absolute w-[60vmax] h-[60vmax] rounded-full opacity-[0.25] mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.35) 0%, transparent 55%)',
                    left: '30%',
                    top: '20%',
                }}
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 40, 0],
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="absolute w-[50vmax] h-[50vmax] rounded-full opacity-[0.15] mix-blend-screen -translate-x-1/2 -translate-y-1/2"
                style={{
                    background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, transparent 60%)',
                    left: '50%',
                    top: '50%',
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Cursor spotlight - follows mouse */}
            <motion.div
                className="absolute w-[min(80vw,400px)] h-[min(80vw,400px)] rounded-full opacity-[0.2] mix-blend-screen -translate-x-1/2 -translate-y-1/2"
                style={{
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)',
                    left: springX,
                    top: springY,
                }}
            />
        </div>
    );
}
