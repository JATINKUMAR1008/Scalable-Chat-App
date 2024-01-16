import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface IProps {
  imageUrl: string;
  firstName: string;
}
export default function AvatarComponent({ imageUrl, firstName }: IProps) {
  return (
    <Avatar>
      <AvatarImage src={imageUrl} alt={firstName} />
      <AvatarFallback className="uppercase">
        {firstName.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
