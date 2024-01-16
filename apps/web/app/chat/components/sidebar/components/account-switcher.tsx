import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GetInfo } from "../../../../../services/auth/auth.service";
import Image from "next/image";
import { useAuth } from "../../../../../context/auth-provider";
interface IProps {
  isCollapsed: boolean;
  linkedAccounts: {
    id: string;
    userId: string;
    linkedUserId: string;
  }[];
  user: {};
}

interface IAccountsProps {
  accounts: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    id: string;
  }[];
}

export default function AccountSwitcher({
  isCollapsed,
  linkedAccounts,
  user,
}: IProps) {
  const { setAccount, token } = useAuth();
  const [accounts, setAccounts] = React.useState<IAccountsProps["accounts"]>(
    []
  );
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(
    null
  ); // Update the type of selectedAccount

  React.useEffect(() => {
    const fetchAccounts = async () => {
      const accountData = await Promise.all(
        linkedAccounts.map(async (account) => {
          const res = await GetInfo(account.linkedUserId);
          return res.user;
        })
      );
      setAccounts(accountData);
    };

    fetchAccounts();
  }, [linkedAccounts]);

  return (
    <Select
      onValueChange={(e: string) => {
        console.log(e);
        setSelectedAccount(e);
        setAccount?.(e, token);
      }}
    >
      <SelectTrigger
        className={cn(
          "flex items-center  gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Accounts</SelectLabel>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                {account.email}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
