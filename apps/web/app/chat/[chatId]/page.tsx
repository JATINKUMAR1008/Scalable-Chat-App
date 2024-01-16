"use client";
import { useCallback, useEffect, useMemo } from "react";

import MessageSection from "../components/message-section/section";

import { useSocket } from "../../../context/socket-provider";

interface IProps {
  params: {
    chatId: string;
  };
}
export default function Page({ params }: IProps) {
  const { socket } = useSocket();
  const emitConnect = useCallback(() => {
    if (params.chatId) {
      socket.emit("event:connectToRoom", {
        receiverId: params.chatId,
      });
    }
  }, [params.chatId, socket]);
  useEffect(() => {
    emitConnect();
  }, [params.chatId]);
  return params.chatId && <MessageSection chatId={params.chatId} />;
}
