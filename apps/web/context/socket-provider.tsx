"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-provider";
interface IProps {
  children: React.ReactNode;
}
interface messagePayload {
  senderId: string;
  receiverId: string;
  chatId: string;
  content: string;
  createdAt: string;
}
interface IMessageProps {
  senderId: string;
  receiverId: string;
  message: string;
  time: string;
}
interface ISequenceObject {
  createdAt: string;
  id: number;
  lastMessage: string;
  lastMessageTime: string;
  receiverId: string;
  senderId: string;
  updatedAt: string;
}
interface ISocketContext {
  sendMessage: (payload: IMessageProps) => void;
  joinRoom: (receiverId: string) => any;
  socket: Socket;
  joined: boolean;
  sequenceList: ISequenceObject[];
  messages: IMessageProps[];
  groupList: any[];
  onlineQueue: any[]; // Add the 'messages' property
}
const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("SocketProvider not found");
  return state;
};

export const SocketProvider: React.FC<IProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [sequenceList, setSequenceList] = useState<ISequenceObject[]>([]);
  const [messages, setMessages] = useState<IMessageProps[]>([]);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [onlineQueue, setOnlineQueue] = useState<any[]>([]);
  const onJoinedSuccessFully = useCallback((payload: { status: boolean }) => {
    console.log(payload);
    if (payload.status) {
      setJoined(true);
    }
  }, []);
  const joinRoom = (receiverId: string) => {
    if (socket) {
      socket.emit("event:connectToRoom", { receiverId });
    }
  };
  const onGetSequenceList = (payload: ISequenceObject[]) => {
    console.log(payload);
    setSequenceList(payload);
  };
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("message object", msg);
      if (socket) {
        socket.emit("event:message", msg);
      }
    },
    [socket]
  );
  const onMessageReceived = useCallback((msg: string) => {
    console.log(msg);
    const payload = JSON.parse(msg);
    setMessages((prev) => [...prev, payload]);
  }, []);
  const onReceiveMEssages = (payload: messagePayload[]) => {
    console.log("chat history", payload);

    const data = payload.map((item: messagePayload) => {
      return {
        senderId: item.senderId,
        receiverId: item.receiverId,
        message: item.content,
        time: item.createdAt,
      };
    });
    setMessages(data);
  };
  const onGroupListReceived = (payload: any[]) => {
    console.log("group list", payload);
    setGroupList(payload);
  };
  const onGetOnlineQueue = (payload: any[]) => {
    console.log("online users", payload);
    setOnlineQueue(payload);
  };
  useEffect(() => {
    if (user) {
      const _socket = io("http://localhost:4000", {
        query: { userId: user?.id },
      });

      _socket.on("event:joinedSuccessfully", onJoinedSuccessFully);
      _socket.on("event:sequenceList", onGetSequenceList);
      _socket.on("message", onMessageReceived);
      _socket.on("messages", onReceiveMEssages);
      _socket.on("event:groupList", onGroupListReceived);
      _socket.on("onlineQueue", onGetOnlineQueue);
      setSocket(_socket);
      return () => {
        _socket.disconnect();
        setSocket(null);
      };
    }
  }, [user]);

  return (
    user &&
    socket && (
      <SocketContext.Provider
        value={{
          joinRoom,
          socket,
          joined,
          sequenceList,
          sendMessage,
          messages,
          groupList,
          onlineQueue,
        }}
      >
        {children}
      </SocketContext.Provider>
    )
  );
};
