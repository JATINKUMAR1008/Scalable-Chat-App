import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSequence } from "../../../../../context/sequence-list-provider";
import { Avatar } from "@radix-ui/react-avatar";
import AvatarComponent from "./avatar-components";
import { useRouter } from "next/navigation";
import { useTabsSwitchContext } from "../../../../../context/tabs-switch-context";
import { useGroupChats } from "../../../../../context/group-list-provider";
import { PlusCircleIcon } from "lucide-react";
import CreateGroupDialog from "./create-group-dialog";

interface IProps {
  messageLinks: {
    from: string;
    avatar: React.ReactNode;
    message: string;
    time: Date;
    label?: string;
    variant: "default" | "ghost";
  }[];
}
export default function MessageBar({ messageLinks }: IProps) {
  const [dataList, setDataList] = useState<any[]>([]);
  const { selectedTab } = useTabsSwitchContext();
  const { dataList: sequenceList, changeVariant } = useSequence();
  const { dataList: groupList } = useGroupChats();
  useEffect(() => {
    console.log(selectedTab);
    if (selectedTab.toLowerCase() === "chats") {
      setDataList(sequenceList);
    } else if (selectedTab.toLowerCase() === "groups") {
      setDataList(groupList);
    }
  }, [selectedTab, sequenceList, groupList]);
  const router = useRouter();
  return (
    <div className="w-full flex flex-col group py-2 gap-4 px-2 h-screen border-r-[1px] ">
      <h1 className="mb-4 my-2 text-xl font-semibold ml-2">Messages</h1>
      {selectedTab.toLowerCase() === "groups" && (
        <CreateGroupDialog>
          <Button>
            <PlusCircleIcon size={20} />
            <h3 className="ml-2 font-semibold">New Group</h3>
          </Button>
        </CreateGroupDialog>
      )}
      <nav className="grid gap-3 w-full px-2 ">
        {dataList.map((link, i) => (
          <Link
            href={`/chat/${link.id}`}
            key={i}
            className={cn(
              link.variant === "default" &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white bg-primary text-primary-foreground",
              "justify-start w-full h-14 flex items-center gap-3 px-2 rounded-md hover:bg-muted"
            )}
            onClick={() => {
              changeVariant(link.id);
              localStorage.setItem("selectedId", link.id);
            }}
          >
            <AvatarComponent
              imageUrl={link.imageUrl}
              firstName={link.firstName}
            />
            <div className="flex flex-col items-start py-2">
              <h3 className="font-semibold text-sm capitalize">
                {`${link.firstName} ` + `${link.lastName}`}
              </h3>
              <p className="text-xs font-extralight">{link.lastMessage}</p>
            </div>
            {link.label && (
              <span
                className={cn(
                  "ml-auto",
                  link.variant === "default" &&
                    "text-background dark:text-white text-sm"
                )}
              >
                {link.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
