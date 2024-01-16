import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import useDebounce from "../../../../../hooks/input-debounce";
import { useQuery } from "react-query";
import { GetList } from "../../../../../services/auth/auth.service";
import { useAuth } from "../../../../../context/auth-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AvatarComponent from "./avatar-components";
import { useRouter } from "next/navigation";

export default function SeearchDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [input, setInput] = useState<string>("");
  const debounceSearch = useDebounce(input);
  const [dataList, setDataList] = useState<any[]>([]);
  const { token } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["search", "debouncedValue"],
    queryFn: () => GetList(token),
  });
  useEffect(() => {
    if (data) {
      setDataList(data.data);
    }
  }, [data]);
  useEffect(() => {
    if (debounceSearch.length > 0) {
      const filteredList = dataList.filter((item) =>
        item.firstName.toLowerCase().includes(debounceSearch.toLowerCase())
      );
      setDataList(filteredList);
    } else {
      setDataList(data?.data);
    }
  }, [debounceSearch]);
  const router = useRouter();
  return (
    data && (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="capitalize font-extrabold text-2xl">
                Search for a user
              </DrawerTitle>
              <DrawerDescription>
                Search for a user to start chatting with them
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <Label htmlFor="f-serach">Search here</Label>
              <Input
                id="f-serach"
                placeholder="Search..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[220px] mt-4 px-3">
              <div className="w-full h-full ">
                {dataList?.map((item) => (
                  <>
                    <div
                      className="w-full h-full flex items-center hover:bg-muted rounded-md px-2 cursor-pointer py-1"
                      onClick={() => {
                        router.push(`/chat/${item.id}`);
                        const element = document.getElementById("btn-cls");
                        if (element) {
                          element.click();
                        }
                      }}
                    >
                      <AvatarComponent
                        imageUrl={item.imageUrl}
                        firstName={item.firstName}
                      />
                      <div className="w-full px-2 py-3 capitalize  text-sm font-semibold">
                        {item.firstName + " " + item.lastName}
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </>
                ))}
              </div>
            </ScrollArea>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" id="btn-cls">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    )
  );
}
