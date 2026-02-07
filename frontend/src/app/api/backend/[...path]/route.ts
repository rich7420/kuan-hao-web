import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:3001";

/**
 * Proxy to Rust backend so the browser hits same origin (no CORS)
 * and we explicitly forward all request headers (e.g. x-magic-key for dashboard).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

async function proxy(
  request: NextRequest,
  { path }: { path: string[] }
) {
  const pathStr = path?.length ? path.join("/") : "";
  const url = `${BACKEND_URL}/api/${pathStr}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    headers.set(key, value);
  });

  const hasMagicKey = request.headers.get("x-magic-key") !== null;
  console.log("[api/backend proxy]", request.method, pathStr, "->", url, "x-magic-key:", hasMagicKey);

  try {
    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

    const res = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    console.log("[api/backend proxy]", pathStr, "backend status:", res.status);

    const resHeaders = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "transfer-encoding") {
        resHeaders.set(key, value);
      }
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error("[api/backend proxy] fetch failed", pathStr, err);
    return NextResponse.json(
      { error: "Backend unreachable" },
      { status: 502 }
    );
  }
}
