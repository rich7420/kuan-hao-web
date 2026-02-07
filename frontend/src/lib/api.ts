// In dev: use same-origin proxy /api/backend so we avoid CORS. In prod: use real backend URL.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "/api/backend";

export async function sendContactForm(data: { name: string; email: string; message: string }) {
    const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { message?: string; detail?: string };
        const msg = errorData.detail
            ? `${errorData.message ?? "Server error"}: ${errorData.detail}`
            : (errorData.message || `Server error: ${response.status}`);
        throw new Error(msg);
    }

    return response.json();
}
