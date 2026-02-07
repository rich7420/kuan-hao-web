"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface DashboardData {
    visitor_count: number;
    recent_messages: {
        name: string;
        email: string;
        message: string;
        created_at?: string; // ISO from backend
        timestamp?: number;   // Unix seconds (legacy)
    }[];
}

// Use e.code so it works regardless of keyboard layout (physical key: ArrowUp, KeyB, KeyA)
const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];

// Module-level: survives React Strict Mode remount so we only ever trigger once per "session"
let konamiTriggered = false;

export default function DashboardModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [keySequence, setKeySequence] = useState<string[]>([]);

    const fetchDashboardData = useCallback(async () => {
        setError(null);
        setData(null);
        try {
            const res = await fetch(`${API_BASE}/dashboard?t=${Date.now()}`, {
                cache: "no-store",
                headers: {
                    "x-magic-key": "open-sesame"
                }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                setError(res.status === 500
                    ? "無法載入。請確認：1) 後端已執行（cd backend && cargo run） 2) port 3001 沒被佔用（lsof -ti:3001 | xargs kill -9）"
                    : `載入失敗 (${res.status})`);
            }
        } catch (err) {
            console.error("Failed to fetch dashboard", err);
            setError("無法連線到後端。請在專案目錄執行：cd backend && cargo run");
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore key repeat (holding a key fires keydown many times) so we only trigger once
            if (e.repeat) return;
            const key = e.code;
            if (!key || key === "Unidentified") return;

            const isInput = (e.target as HTMLElement)?.closest?.("input, textarea, select");
            if (!isInput && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
                e.preventDefault();
            }

            setKeySequence((prev) => {
                const newSequence = [...prev, key];
                if (newSequence.length > KONAMI_CODE.length) {
                    newSequence.shift();
                }

                if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
                    if (!konamiTriggered) {
                        konamiTriggered = true;
                        console.log("🎉 Konami Code Activated!");
                        fetchDashboardData();
                        setIsOpen(true);
                    }
                    return []; // Reset sequence so it won’t match again until they type the code again
                }

                return newSequence;
            });
        };

        const target = typeof document !== "undefined" ? document : null;
        if (!target) return;
        target.addEventListener("keydown", handleKeyDown, true);

        const onOpenEvent = () => {
            if (!konamiTriggered) {
                konamiTriggered = true;
                fetchDashboardData();
                setIsOpen(true);
            }
        };
        target.addEventListener("open-dashboard", onOpenEvent);

        return () => {
            target.removeEventListener("keydown", handleKeyDown, true);
            target.removeEventListener("open-dashboard", onOpenEvent);
        };
    }, [fetchDashboardData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-[#111] border border-white/10 p-8 shadow-2xl relative">
                <button
                    onClick={() => {
                        setIsOpen(false);
                        setKeySequence([]);
                        setError(null);
                        konamiTriggered = false;
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
                    Hidden Admin Dashboard
                </h2>

                {error ? (
                    <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-center">
                        <p className="text-red-300 mb-2">{error}</p>
                        <p className="text-sm text-gray-400">關閉此視窗後可再試一次。</p>
                    </div>
                ) : data ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Visitors</h3>
                                <p className="text-4xl font-mono text-white">{data.visitor_count}</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Messages</h3>
                                <p className="text-4xl font-mono text-white">{data.recent_messages.length}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Recent Messages</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {data.recent_messages.map((msg, idx) => (
                                    <div key={idx} className="rounded-xl bg-white/5 p-4 border border-white/5 text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-cyan-300">{msg.name}</span>
                                            <span className="text-xs text-gray-500">
                                                {msg.created_at
                                                    ? new Date(msg.created_at).toLocaleString()
                                                    : msg.timestamp != null
                                                        ? new Date(msg.timestamp * 1000).toLocaleString()
                                                        : "—"}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 italic mb-2">{msg.email}</p>
                                        <p className="text-gray-300">{msg.message}</p>
                                    </div>
                                ))}
                                {data.recent_messages.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">No messages yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
