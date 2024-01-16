import React, { useContext, createContext, useState, useEffect } from "react";
import { useSocket } from "./socket-provider";

interface GroupChatsContext {
  dataList: any[];
}

const groupChatContext = createContext<GroupChatsContext | null>(null);
export const useGroupChats = () => {
  const state = useContext(groupChatContext);
  if (!state) throw new Error("GroupChatsProvider not found");
  return state;
};

export default function GroupChatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataList, setDataList] = useState<any[]>([]);
  const { groupList } = useSocket();
  useEffect(() => {
    setDataList(groupList);
  }, [groupList]);
  return (
    <groupChatContext.Provider value={{ dataList }}>
      {children}
    </groupChatContext.Provider>
  );
}
