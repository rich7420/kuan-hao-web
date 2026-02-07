"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { sendContactForm } from "@/lib/api";

import MotionCard from '../ui/MotionCard';

export default function ContactBlock() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const validateForm = () => {
        if (formData.name.length < 1 || formData.name.length > 100) {
            setErrorMessage("Name must be between 1 and 100 characters");
            return false;
        }
        if (formData.message.length < 1 || formData.message.length > 5000) {
            setErrorMessage("Message must be between 1 and 5000 characters");
            return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (!validateForm()) {
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            await sendContactForm(formData);
            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
            setTimeout(() => {
                setStatus("idle");
                setErrorMessage("");
            }, 5000);
        }
    };

    return (
        <MotionCard delay={0.4}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-white/20">
                <div className="mb-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        Contact Me
                    </h3>
                    <p className="text-sm text-[#C0C0C0]">Let's build something amazing together.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-grow">
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        disabled={status === "loading"}
                        className="bg-black/20 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        disabled={status === "loading"}
                        className="bg-black/20 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <textarea
                        placeholder="Message"
                        required
                        rows={3}
                        disabled={status === "loading"}
                        className="bg-black/20 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none flex-grow border border-transparent focus:border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />

                    {status === "error" && errorMessage && (
                        <p className="text-red-400 text-xs -mt-2">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className={`mt-auto flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold transition-all duration-300 ${status === "success"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : status === "error"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-white/10 hover:bg-white/20 text-white border border-white/5 hover:border-white/10"
                            }`}
                    >
                        {status === "idle" && (
                            <>
                                Send Message <Send size={16} />
                            </>
                        )}
                        {status === "loading" && (
                            <>
                                Sending... <Loader2 size={16} className="animate-spin" />
                            </>
                        )}
                        {status === "success" && (
                            <>
                                Sent! <CheckCircle size={16} />
                            </>
                        )}
                        {status === "error" && (
                            <>
                                Failed <AlertCircle size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </MotionCard>
    );
}
