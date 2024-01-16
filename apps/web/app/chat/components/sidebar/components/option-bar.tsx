import { ModeToggle } from "@/components/theme-toggle";
import AccountSwitcher from "./account-switcher";
import {
  User,
  Briefcase,
  Users,
  MessageCircle,
  UserCheck,
  Star,
  LogOut,
  Settings,
  Search,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import NavComponent from "./nav";
import FavComponent from "./favourites";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "../../../../../context/auth-provider";
import SettingSideSheet from "./settings/setting-sheet";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SeearchDrawer from "./search-dialog";
import AvatarComponent from "./avatar-components";

interface IProps {
  isCollapsed: boolean;
}

const dummyAccounts = [
  {
    label: "personal",
    email: "test@xyz.com",
    icon: <User />,
  },
  {
    label: "work",
    email: "test2@xyz.com",
    icon: <Briefcase />,
  },
];
const links = [
  {
    title: "Chats",
    label: "1",
    icon: MessageCircle,
    variant: "default" as const,
  },
  {
    title: "Groups",
    label: "1",
    icon: Users,
    variant: "ghost" as const,
  },
  {
    title: "Friends",
    label: "1",
    icon: UserCheck,
    variant: "ghost" as const,
  },
];
const favRoomsOpen = [
  {
    title: "Room1",
    label: "1",
    icon: <MessageCircle className="mr-2 h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Room2",
    label: "1",
    icon: <Users className="mr-2 h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Room3",
    label: "1",
    icon: <UserCheck className="mr-2 h-4 w-4" />,
    variant: "ghost" as const,
  },
];
const favRoomsCollapsed = [
  {
    title: "Room1",
    label: "1",
    icon: <MessageCircle className=" h-5 w-5" />,
    variant: "default" as const,
  },
  {
    title: "Room2",
    label: "1",
    icon: <Users className=" h-5 w-5" />,
    variant: "ghost" as const,
  },
  {
    title: "Room3",
    label: "1",
    icon: <UserCheck className=" h-5 w-5" />,
    variant: "ghost" as const,
  },
];
export default function OptionBar({ isCollapsed }: IProps) {
  const { logOut, user } = useAuth();
  return (
    <div className="flex flex-col  items-start w-full h-screen relative py-2 px-1 border-r-[1px]">
      <div className="w-full hover:bg-muted rounded-md cursor-pointer">
        <div className="grid h-full gap-3 grid-cols-4 items-center p-2">
          <AvatarComponent
            imageUrl={user?.imageUrl || ""}
            firstName={user?.firstName || ""}
          />
          {!isCollapsed && (
            <p className="col-span-3 text-sm font-semibold ml-3 capitalize">
              {user?.firstName + " " + user?.lastName}
            </p>
          )}
        </div>
      </div>
      <Separator className="my-3" />
      <NavComponent isCollapsed={isCollapsed} links={links} />
      <Separator className="my-3" />

      {!isCollapsed && (
        <div className="flex items-center ml-2 my-2">
          <Star size={18} />
          <h1 className="font-semibold text-md  ml-2">Favorites</h1>
        </div>
      )}

      {isCollapsed ? (
        <FavComponent isCollapsed={isCollapsed} links={favRoomsCollapsed} />
      ) : (
        <FavComponent isCollapsed={isCollapsed} links={favRoomsOpen} />
      )}
      <Separator className="my-3" />
      <div className="w-full px-2 h-full">
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <SeearchDrawer>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white w-full justify-center flex p-2 rounded-md"
                  }
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only capitalize">Search</span>
                </Link>
              </TooltipTrigger>
            </SeearchDrawer>
            <TooltipContent side="right" className="flex items-center gap-4">
              Search
            </TooltipContent>
          </Tooltip>
        ) : (
          <SeearchDrawer>
            <Link
              href="#"
              className={cn(
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start w-full flex items-center p-2 rounded-md"
              )}
            >
              <Search className="mr-2 h-4 w-4 capitalize" />
              Search
            </Link>
          </SeearchDrawer>
        )}
      </div>
      <div className="absolute bottom-2 ml-2 flex flex-col gap-2 items-start">
        <Tooltip key={1} delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-[3rem]" onClick={logOut}>
              <LogOut size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div>
              <h1 className="text-sm font-bold capitalize">Log out</h1>
            </div>
          </TooltipContent>
        </Tooltip>
        <Tooltip key={2} delayDuration={0}>
          <SettingSideSheet>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-[3rem]">
                <Settings size={20} />
              </Button>
            </TooltipTrigger>
          </SettingSideSheet>

          <TooltipContent side="right">
            <div>
              <h1 className="text-sm font-bold capitalize">Settings</h1>
            </div>
          </TooltipContent>
        </Tooltip>
        <Tooltip key={3} delayDuration={0}>
          <TooltipTrigger asChild>
            <ModeToggle />
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            <div>
              <h1 className="text-sm font-bold capitalize z-10 relative">
                Theme change
              </h1>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
