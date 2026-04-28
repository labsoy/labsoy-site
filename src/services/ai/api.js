const API_URL = (import.meta.env.VITE_OLLAMA_API_URL || "").trim().replace(/\/$/, "");
const AI_CONFIGURED = Boolean(API_URL);
const HEALTH_URL = (import.meta.env.VITE_OLLAMA_HEALTH_URL || "").trim().replace(/\/$/, "");
const AI_CONFIG_ERROR =
  "AI chat is not configured. Define VITE_OLLAMA_API_URL in build environment variables.";

const readErrorMessage = async (res) => {
  try {
    const data = await res.json();
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error.trim();
    }
  } catch {}
  return `${res.status} ${res.statusText}`.trim();
};

const normalizeChatResponse = (payload) => {
  const text =
    (typeof payload?.message?.content === "string" && payload.message.content.trim()) ||
    (typeof payload?.response === "string" && payload.response.trim()) ||
    (typeof payload?.message === "string" && payload.message.trim()) ||
    (typeof payload?.content === "string" && payload.content.trim()) ||
    "";

  return {
    message: {
      content: text,
    },
  };
};

export const chat = async (message) => {
  if (!AI_CONFIGURED) {
    throw new Error(AI_CONFIG_ERROR);
  }

  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("application/json")) {
    const data = await res.json();
    return normalizeChatResponse(data);
  }

  const text = (await res.text()).trim();
  return normalizeChatResponse({ response: text });
};

export const checkHealth = async () => {
  if (!AI_CONFIGURED) {
    return { status: "offline" };
  }

  if (!HEALTH_URL) {
    return { status: "unknown" };
  }

  try {
    const res = await fetch(HEALTH_URL);
    if (!res.ok) {
      return { status: "offline" };
    }
    return { status: "online" };
  } catch {
    return { status: "offline" };
  }
};