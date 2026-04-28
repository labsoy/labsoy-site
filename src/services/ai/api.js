const API_URL = import.meta.env.VITE_OLLAMA_API_URL;
const MODEL = import.meta.env.VITE_OLLAMA_MODEL;

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
  const res = await fetch(`${API_URL}/api/tags`);
  if (!res.ok) {
    return { status: "offline" };
  }
  return { status: "online" };
};