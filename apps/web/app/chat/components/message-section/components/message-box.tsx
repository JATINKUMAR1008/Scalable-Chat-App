import React, { useEffect, useRef } from "react";
import { useAuth } from "../../../../../context/auth-provider";
import { useSocket } from "../../../../../context/socket-provider";

function MessageBox() {
  const { messages } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  useEffect(() => {
    (messagesEndRef.current as HTMLDivElement | null)?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  return messages.length > 0 ? (
    <div className="w-full flex flex-col scroll-smooth gap-4 overflow-y-auto">
      {messages.map((message, i) => {
        if (message.senderId === user?.id) {
          return (
            <div className="w-full h-fit" key={i}>
              <div className="w-fit h-full px-3 py-4 bg-muted float-right flex flex-col items-start rounded-[10px_10px_0px_15px]">
                {message.message}
                <p className="text-xs font-extralight w-full text-right">
                  {convertDateString(message.time)}
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="w-full h-fit" key={i}>
              <div className="w-fit h-full px-3 py-4 dark:bg-white  flex flex-col items-start  dark:text-black bg-primary text-primary-foreground float-left rounded-[10px_10px_15px_0px]">
                {message.message}
                <p className="text-xs font-extralight">
                  {convertDateString(message.time)}
                </p>
              </div>
            </div>
          );
        }
      })}
      <div ref={messagesEndRef} />
    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-2xl capitalize font-semibold ">No Chats till now.</h1>
    </div>
  );
}
function convertDateString(date: string) {
  const date_str = new Date(date);
  const timeStr = date_str.toLocaleString("default", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return timeStr;
}
export default MessageBox;
