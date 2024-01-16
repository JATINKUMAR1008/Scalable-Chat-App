"use client";
import { SocketProvider } from "../../context/socket-provider";
import { AuthProvider, useAuth } from "../../context/auth-provider";
import { useEffect, useState } from "react";
import QueryProvider from "../../context/query-provider";
import SideBar from "./components/sidebar/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import useRedirectHook from "../../hooks/redirect-hook";
import { useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SequenceProvider from "../../context/sequence-list-provider";
import TabsSwitchContextProvider from "../../context/tabs-switch-context";
import GroupChatsProvider from "../../context/group-list-provider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const getLocalStorageItem = (key: string) => {
    return typeof window !== "undefined"
      ? window.localStorage.getItem(key)
      : null;
  };
  useEffect(() => {
    setToken(getLocalStorageItem("chat-token"));
  });
  useEffect(() => {
    const truthy = useRedirectHook();
    if (!truthy) {
      router.push("/auth/login");
    }
  });
  return token ? (
    <QueryProvider>
      <AuthProvider token={token}>
        <TooltipProvider>
          <TabsSwitchContextProvider>
            <SocketProvider>
              <SequenceProvider>
                <GroupChatsProvider>
                  <div className="w-full h-full flex">
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="w-full"
                    >
                      <ResizablePanel defaultSize={30}>
                        <SideBar />
                      </ResizablePanel>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={70}>
                        {children}
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                </GroupChatsProvider>
              </SequenceProvider>
            </SocketProvider>
          </TabsSwitchContextProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  ) : (
    <>Error</>
  );
}
