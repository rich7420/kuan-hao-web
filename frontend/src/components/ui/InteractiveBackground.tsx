'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function InteractiveBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 700 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const x1 = useTransform(springX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-50, 50]);
    const y1 = useTransform(springY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-50, 50]);

    const x2 = useTransform(springX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [50, -50]);
    const y2 = useTransform(springY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [50, -50]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0A0E27]">
            {/* Primary Blob - Cool Blue */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[80px] mix-blend-screen animate-blob will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    x: x1,
                    y: y1
                }}
            />

            {/* Secondary Blob - Cyan */}
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[80px] mix-blend-screen animate-blob animation-delay-2000 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
                    x: x2,
                    y: y2
                }}
            />

            {/* Tertiary Blob - Indigo */}
            <motion.div
                className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full blur-[80px] mix-blend-screen animate-blob animation-delay-4000 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                    x: x1,
                    y: y2
                }}
            />

            {/* SPOTLIGHT EFFECT - Cool blue tone */}
            <motion.div
                className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0 mix-blend-screen will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            />
        </div>
    );
}
