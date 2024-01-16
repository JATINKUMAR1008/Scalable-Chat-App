"use client";
import { createContext, useContext, useEffect } from "react";
import { useSocket } from "./socket-provider";

interface IMessage {
  senderId: string;
  receiverId: string;
  message: string;
  time: string;
}
interface IMessageContext {}

interface IMessagePayload {
  senderId: string;
  receiverId: string;
  chatId: string;
  content: string;
  createdAt: string;
}

const MessageContext = createContext<IMessageContext | null>(null);

export const useMessageContext = () => {
  const state = useContext(MessageContext);
  if (!state) throw new Error("MessageContext not found");
  return state;
};

export default function MessageContextProvider({
  children,
  chatId,
}: {
  children: React.ReactNode;
  chatId: string;
}) {
  const { socket, messages } = useSocket();

  useEffect(() => {
    socket.emit("event:getChatMessages", {
      receiverId: chatId,
    });
  }, []);
  useEffect(() => {
    console.log("connecting to room...");
    socket.emit("event:connectToRoom", {
      receiverId: chatId,
    });
  });
  return (
    <MessageContext.Provider value={{}}>{children}</MessageContext.Provider>
  );
}
