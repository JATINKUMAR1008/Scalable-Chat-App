import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./socket-provider";
import { useAuth } from "./auth-provider";
import { GetInfo } from "../services/auth/auth.service";
import { useRouter } from "next/navigation";
import { useTabsSwitchContext } from "./tabs-switch-context";

interface IUserProps {
  firstName: string;
  lastName: string;
  imageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface ISequenceContext {
  dataList: any[];
  changeVariant: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  selectedUser: IUserProps | null; // Update the type of dataList to allow for an array of any type
}
interface IProps {
  children: React.ReactNode;
}
const sequenceContext = createContext<ISequenceContext | null>(null);

export const useSequence = () => {
  const state = useContext(sequenceContext);
  if (!state) throw new Error("SequenceProvider not found");
  return state;
};

export default function SequenceProvider({ children }: IProps) {
  const { sequenceList } = useSocket();
  const { selectedTab } = useTabsSwitchContext();
  const { user } = useAuth();
  const router = useRouter();
  const [dataList, setDataList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null); // Update the type of dataList to any[]
  const changeVariant = (id: string) => {
    console.log("changeVariant Called");
    const newDataList = dataList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          variant: "default",
        };
      } else {
        return {
          ...item,
          variant: "ghost",
        };
      }
    });
    console.log(dataList);
    const filteredList = dataList.filter((item) => item.variant === "default");
    setSelectedUser(filteredList[0]);
    setDataList(newDataList);
  };
  useEffect(() => {
    if (sequenceList.length > 0) {
      const data = sequenceList.map((item) => {
        if (item.receiverId !== user?.id) {
          return {
            id: item.receiverId,
            lastMessage: item.lastMessage,
            lastMessageTime: item.lastMessageTime,
          };
        } else {
          return {
            id: item.senderId,
            lastMessage: item.lastMessage,
            lastMessageTime: item.lastMessageTime,
          };
        }
      });

      const fetchData = async () => {
        const userData = await Promise.all(
          data.map(async (item) => {
            const res = await GetInfo(item.id);
            return {
              ...res.user,
              lastMessage: item.lastMessage,
              lastMessageTime: item.lastMessageTime,
              variant: "ghost",
            };
          })
        );
        setDataList(userData as any[]);
      };
      fetchData();
    }
  }, [sequenceList]);

  return (
    <sequenceContext.Provider
      value={{
        dataList: dataList,
        changeVariant,
        setSelectedId,
        selectedUser,
      }}
    >
      {children}
    </sequenceContext.Provider>
  );
}
