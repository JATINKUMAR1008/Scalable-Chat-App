import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSocket } from "../../../../../context/socket-provider";
import { useEffect, useState } from "react";
interface IProps {
  firstName: string;
  lastName: string;
  imageUrl: string;
  lastMessageTime: string;
  id: string;
}
export default function TopBar({
  firstName,
  lastName,
  imageUrl,
  lastMessageTime,
  id,
}: IProps) {
  const date = new Date(lastMessageTime);
  const day = date.toLocaleString("default", { weekday: "long" });
  const dateStr = date.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { onlineQueue } = useSocket();
  const [status, setStatus] = useState("Offline");
  useEffect(() => {
    onlineQueue.map((item) => {
      if (item.userId === id) {
        setStatus("Online");
        return;
      }
    });
    return () => {
      setStatus("Offline");
    };
  }, [onlineQueue]);
  return (
    <>
      <div className="py-4 px-6 w-full h-fit max-h-fit items-start flex">
        <Avatar>
          <AvatarImage src={imageUrl} alt={firstName} />
          <AvatarFallback className="uppercase">
            {firstName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start w-fit h-full ">
          <h1 className="text-2xl font-semibold capitalize px-3 ">
            {`${firstName} ` + `${lastName}`}
          </h1>
          <p
            className={`my-2 text-xs font-semibold  px-3 ${
              status === "Online" ? `text-green-600` : "text-red-500"
            }`}
          >
            {status}
          </p>
        </div>
        <Separator orientation="vertical" className="h-16 ml-5" />
        <div className="flex flex-col w-fit h-full px-4 gap-2">
          <h1 className="text-sm font-semibold">Last Message On</h1>
          <p className="text-xs font-extralight">{`${day}, ${dateStr}`}</p>
        </div>
      </div>
      <Separator className="my-1 w-full bottom-2" />
    </>
  );
}
