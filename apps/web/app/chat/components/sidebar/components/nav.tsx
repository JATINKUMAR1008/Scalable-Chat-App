import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTabsSwitchContext } from "../../../../../context/tabs-switch-context";
import { useEffect, useState } from "react";

interface ILinkProps {
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
}

interface IProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
  }[];
}
export default function NavComponent({ isCollapsed, links }: IProps) {
  const { selectedTab, setSelectedTab } = useTabsSwitchContext();
  const [list, setList] = useState<ILinkProps[]>([]);
  useEffect(() => {
    const selectLinkList = links.map((link) => {
      if (link.title.toLowerCase() === selectedTab.toLowerCase()) {
        return {
          ...link,
          variant: "default" as const,
        };
      } else {
        return {
          ...link,
          variant: "ghost" as const,
        };
      }
    });
    setList(selectLinkList);
  }, [selectedTab]);
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 w-full"
    >
      <nav className="grid gap-1 w-full px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {list.map((link, i) =>
          isCollapsed ? (
            <Tooltip key={i} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                  onClick={() => setSelectedTab(link.title)}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={i}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start w-full"
              )}
              onClick={() => setSelectedTab(link.title)}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
