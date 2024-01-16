import { createContext, useContext, useState } from "react";

interface ITabsSwitchContext {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

interface IProps {
  children: React.ReactNode;
}

const TabsSwitchContext = createContext<ITabsSwitchContext | null>(null);

export const useTabsSwitchContext = () => {
  const state = useContext(TabsSwitchContext);
  if (!state) throw new Error("TabsSwitchContext not found");
  return state;
};

export default function TabsSwitchContextProvider({ children }: IProps) {
  const [selectedTab, setSelectedTab] = useState<string>("chats");

  return (
    <TabsSwitchContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </TabsSwitchContext.Provider>
  );
}
