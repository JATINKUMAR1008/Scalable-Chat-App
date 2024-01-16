"use client";

import { useEffect } from "react";
import useRedirectHook from "../../hooks/redirect-hook";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    const truthy = useRedirectHook();
    if (truthy) {
      router.push("/chat");
    }
  }, []);
  return <>{children}</>;
}
