import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "../../../../../context/auth-provider";
import { useState } from "react";
import { useSocket } from "../../../../../context/socket-provider";
import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
export default function MessageInput({ chatId }: { chatId: string }) {
  const { user } = useAuth();
  const { sendMessage } = useSocket();
  const [input, setInput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  const handleSubmit = () => {
    sendMessage({
      senderId: user?.id || "",
      receiverId: chatId,
      message: input,
      time: new Date().toISOString(),
    });
    setInput("");
  };
  return (
    <div className="grid w-full h-full">
      <Textarea
        placeholder="Type your message here."
        value={input}
        onChange={handleChange}
      />
      <Button onClick={handleSubmit} disabled={input.length === 0}>
        Submit
      </Button>
    </div>
  );
}
