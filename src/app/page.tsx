"use client";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";

export default function Home() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [text, setText] = useState("");
  const sender = `User-${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = { text, sender };
    socket.emit("message", msg);
    setText("");
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4">
      <div className="flex-1 overflow-y-auto border rounded-lg p-2 mb-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold text-sm text-blue-600">{m.sender}: </span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-3 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
