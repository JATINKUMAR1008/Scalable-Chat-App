import React from "react";
import OptionBar from "./components/option-bar";
import MessageBar from "./components/message-bar";
import { User } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
const messageList = [
  {
    from: "John doe",
    message: "hi",
    avatar: <User />,
    time: new Date(),
    variant: "default" as const,
    label: "1",
  },
  {
    from: "John doe 2",
    message: "hi",
    avatar: <User />,
    time: new Date(),
    variant: "ghost" as const,
    label: "1",
  },
  {
    from: "John do 3",
    message: "hi",
    avatar: <User />,
    time: new Date(),
    variant: "ghost" as const,
    label: "1",
  },
];
export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };
  return (
    <div className="flex">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full"
        onLayout={onLayout}
      >
        <ResizablePanel
          defaultSize={30}
          minSize={10}
          collapsedSize={12}
          collapsible={true}
          onCollapse={() => setIsCollapsed(true)}
          className="min-w-[70px]"
          onExpand={() => setIsCollapsed(false)}
        >
          <OptionBar isCollapsed={isCollapsed} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <MessageBar messageLinks={messageList} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
