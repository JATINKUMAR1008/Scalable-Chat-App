"use client";
import { useRouter } from "next/navigation";
import useRedirectHook from "../hooks/redirect-hook";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const truthy = useRedirectHook();
    if (truthy) {
      router.push("/chat");
    } else {
      router.push("/auth/login");
    }
  }, []);

  return null;
}
