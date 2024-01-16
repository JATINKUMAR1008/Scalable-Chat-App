"use client";
import TopBar from "./components/topbar";
import MessageInput from "./components/message-input";
import MessageBox from "./components/message-box";
import { useEffect, useState } from "react";

import { useSequence } from "../../../../context/sequence-list-provider";
import { GetInfo } from "../../../../services/auth/auth.service";
import MessageContextProvider from "../../../../context/message-context";

interface IProps {
  chatId: string;
}

export default function MessageSection({ chatId }: IProps) {
  const { dataList, changeVariant } = useSequence();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  useEffect(() => {
    if (selectedUser) return;
    // const fetchData = async () => {
    //   const res = await GetInfo(chatId);
    //   setSelectedUser(res.user);
    // };
    if (dataList.length > 0) {
      const filteredList = dataList.filter((item) => item.id === chatId);
      setSelectedUser(filteredList[0]);
    }
    // fetchData();
  }, []);
  return selectedUser ? (
    <div className="w-full flex flex-col h-screen p-3">
      <div className="w-full h-40">
        <TopBar
          imageUrl={selectedUser?.imageUrl}
          firstName={selectedUser?.firstName}
          lastName={selectedUser?.lastName}
          lastMessageTime={selectedUser?.lastMessageTime}
          id={selectedUser?.id}
        />
      </div>
      <div className="w-full min-h-[70%] overflow-auto">
        <MessageContextProvider chatId={chatId}>
          <MessageBox />
        </MessageContextProvider>
      </div>
      <div className="w-full h-2/10 flex items-end">
        <MessageInput chatId={chatId} />
      </div>
    </div>
  ) : (
    <>Not loaded</>
  );
}
