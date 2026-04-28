import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { chat, checkHealth } from "../services/ai/api";
import "../styles/pages/chat.css";

const CHAT_STORAGE_KEY = "labsoy-chat-state-v2";

const isReloadNavigation = () => {
  if (typeof window === "undefined") return false;
  const navEntry = window.performance.getEntriesByType("navigation")[0];
  if (navEntry && navEntry.type === "reload") return true;
  if (window.performance.navigation) {
    return window.performance.navigation.type === 1;
  }
  return false;
};

export const ChatPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      if (isReloadNavigation()) {
        sessionStorage.removeItem(CHAT_STORAGE_KEY);
        return;
      }
      const raw = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.isOpen === "boolean") {
        setIsOpen(parsed.isOpen);
      }
      if (Array.isArray(parsed?.messages)) {
        setMessages(
          parsed.messages.filter(
            (item) =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify({
          isOpen,
          messages,
        })
      );
    } catch {}
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    let active = true;

    const runHealthCheck = async () => {
      try {
        const health = await checkHealth();
        if (active) {
          setStatus(health?.status || "offline");
        }
      } catch {
        if (active) {
          setStatus("offline");
        }
      }
    };

    runHealthCheck();
    const timer = setInterval(runHealthCheck, 15000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { id: Date.now(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await chat(trimmed);
      const content = res?.message?.content?.trim();
      if (content) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
      setStatus("online");
    } catch (error) {
      const content = typeof error?.message === "string" ? error.message.trim() : "";
      if (content) {
        const assistantError = {
          id: Date.now() + 2,
          role: "assistant",
          content,
        };
        setMessages((prev) => [...prev, assistantError]);
      }
      setStatus("offline");
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  return (
    <div className="chat-widget">
      {!isOpen && (
        <button
          type="button"
          className="chat-launcher"
          onClick={() => setIsOpen(true)}
            aria-label={t("chat.openAria")}
        >
          {t("chat.launcherLabel")}
        </button>
      )}

      <div className={`chat ${isOpen ? "chat--open" : ""}`}>
        <div className="chat__header">
          <div className="chat__title">{t("chat.title")}</div>
          <div className="chat__header-right">
            <div className={`chat__status chat__status--${status || "unknown"}`}>
              {status ? t(`status.${status}`) : t("status.unknown")}
            </div>
            <button
              type="button"
              className="chat__close"
              onClick={() => setIsOpen(false)}
              aria-label={t("chat.closeAria")}
            >
              ×
            </button>
          </div>
        </div>
        <div className="chat__messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat__message chat__message--${msg.role}`}
            >
              <div className="chat__bubble">
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat__message chat__message--assistant">
              <div className="chat__bubble">
                <div className="chat__typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="chat__composer">
          <input
            className="chat__field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("chat.placeholder")}
          />
          <button
            type="button"
            className="chat__send"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            aria-label={t("chat.sendAria")}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};