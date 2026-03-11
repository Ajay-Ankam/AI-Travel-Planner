"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Send, Bot, User, PlaneTakeoff, Loader2 } from "lucide-react";
import Button from "@/components/UI/Button";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: '{"resp": "Hi! I\'m your AI Travel Planner ✈️. Let\'s start planning your trip. Where will you be traveling from?", "ui": "source"}',
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUI, setCurrentUI] = useState("source");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e, forcedMessage = null) => {
    e?.preventDefault();
    const messageToSend = forcedMessage || input;
    if (!messageToSend.trim()) return;

    // 1. Update UI with User Message
    const newMessages = [
      ...messages,
      { role: "user", parts: [{ text: messageToSend }] },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. Call Backend
      const { data } = await api.post("/ai/plan", {
        message: messageToSend,
        history: messages, // Send previous context
      });

      // 3. Update with AI Response
      setMessages([
        ...newMessages,
        { role: "model", parts: [{ text: JSON.stringify(data) }] },
      ]);
      setCurrentUI(data.ui);
    } catch (err) {
      console.error(err);
      alert("Lost connection to the travel agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => {
            const isAI = msg.role === "model";
            let content = msg.parts[0].text;

            // If it's AI, we need to parse the JSON 'resp'
            if (isAI) {
              try {
                const parsed = JSON.parse(content);
                content = parsed.resp;
              } catch (e) {
                /* Fallback to raw text */
              }
            }

            return (
              <div
                key={idx}
                className={`flex ${isAI ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${isAI ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? "bg-blue-600" : "bg-gray-800"}`}
                  >
                    {isAI ? (
                      <Bot size={18} className="text-white" />
                    ) : (
                      <User size={18} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${isAI ? "bg-white text-gray-800 rounded-tl-none" : "bg-blue-600 text-white rounded-tr-none"}`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">
                      {content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Dynamic Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {currentUI === "final" ? (
            <Button
              onClick={() => (window.location.href = "/trips")}
              className="w-full"
            >
              View Final Itinerary
            </Button>
          ) : (
            <form
              onSubmit={sendMessage}
              className="relative flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Type your ${currentUI}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none pr-14 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all"
              >
                <Send size={20} />
              </button>
            </form>
          )}

          {/* Quick UI Suggestions (Optional) */}
          {currentUI === "groupSize" && !loading && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {["Solo", "Couple", "Family", "Friends"].map((size) => (
                <button
                  key={size}
                  onClick={(e) => sendMessage(e, size)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 whitespace-nowrap"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
