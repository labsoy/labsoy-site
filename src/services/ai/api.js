const API_URL = (import.meta.env.VITE_OLLAMA_API_URL || "").trim().replace(/\/$/, "");
const MODEL = (import.meta.env.VITE_OLLAMA_MODEL || "").trim();
const AI_CONFIGURED = Boolean(API_URL && MODEL);
const AI_CONFIG_ERROR =
  "AI chat is not configured. Define VITE_OLLAMA_API_URL and VITE_OLLAMA_MODEL in build environment variables.";

const readErrorMessage = async (res) => {
  try {
    const data = await res.json();
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error.trim();
    }
  } catch {}
  return `${res.status} ${res.statusText}`.trim();
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
      model: MODEL,
      stream: false,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json();
};

export const checkHealth = async () => {
  if (!AI_CONFIGURED) {
    return { status: "offline" };
  }

  const res = await fetch(`${API_URL}/api/tags`);
  if (!res.ok) {
    return { status: "offline" };
  }
  return { status: "online" };
};