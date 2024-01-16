import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader2 size={15} className="animate-spin" />
    </div>
  );
}
