// "use client";
import { GoBack } from "@/components";
import { AuthContext } from "@/context/AuthContext";
import { pollMessages, sendChatMessage } from "@/services/chat";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

export default () => {
  const searchParams = useSearchParams();

  const senderId = searchParams.get("senderId");
  const rideId = searchParams.get("rideId");

  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      _id: string;
      message: string;
      userId: {
        _id: string;
        name: string;
      };
      rideId: string;
      timestamp: string;
    }>
  >([]);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const getMessagens = async () => {
      if (!rideId) {
        return;
      }

      const timestampOneWeekAgo = new Date();
      timestampOneWeekAgo.setDate(timestampOneWeekAgo.getDate() - 7);
      const response = await pollMessages(
        rideId,
        timestampOneWeekAgo.toISOString()
      );
      setMessages(response?.data?.messages || []);
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    };

    // refetch messages every 5 seconds

    getMessagens();

    const interval = setInterval(() => {
      getMessagens();
    }, 5000);

    return () => clearInterval(interval);
  }, [rideId]);

  const handleSendMessage = () => {
    if (!rideId || !senderId) {
      return;
    }
    setLoading(true);
    sendChatMessage({
      rideId: rideId!,
      userId: senderId!,
      message,
    }).then((response) => {
      const timestampOneWeekAgo = new Date();
      timestampOneWeekAgo.setDate(timestampOneWeekAgo.getDate() - 7);
      pollMessages(rideId!, timestampOneWeekAgo.toISOString())
        .then((response) => {
          setMessages(response?.data?.messages || []);
        })
        .finally(() => {
          setMessage("");
          setLoading(false);
          setTimeout(() => {
            scrollToBottom();
          }, 300);
        });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <GoBack />
      <div className="bg-white flex gap-2 flex-col items-center p-4 rounded max-h-[75%]">
        <div
          ref={messagesEndRef}
          className="flex flex-col gap-2 p-2 w-[100%] overflow-y-scroll"
        >
          {messages.map((message) => (
            <div
              key={message._id}
              className={clsx("border-4 rounded px-3 py-1 flex flex-col", {
                "self-end bg-slate-300": message.userId._id === user?.userId,
                "self-start bg-blue-300": message.userId._id !== user?.userId,
              })}
            >
              <span
                className={clsx("text-xs text-slate-800", {
                  "self-end": message.userId._id === user?.userId,
                  "self-start": message.userId._id !== user?.userId,
                })}
              >
                {message.userId.name}
              </span>
              <span
                className={clsx({
                  "self-end": message.userId._id == user?.userId,
                })}
              >
                {message.message}
              </span>
              <span
                className={clsx("text-xs text-slate-800", {
                  "self-end": message.userId._id === user?.userId,
                  "self-start": message.userId._id !== user?.userId,
                })}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center text-gray-500">Sem mensagens</div>
          )}
        </div>
        <div className="p-2 flex gap-2">
          <input
            className="border-2 rounded p-2"
            type="text"
            placeholder="Digite sua mensagem"
            disabled={!rideId || !senderId || loading}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="bg-blue-500 text-white rounded p-2"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
