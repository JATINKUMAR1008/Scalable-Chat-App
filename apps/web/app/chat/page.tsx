"use client";
import { useAuth } from "../../context/auth-provider";
import MessageSection from "./components/message-section/section";
export default function Page() {
  const { user } = useAuth();
  return <div className="w-full h-screen">not on chat</div>;
}
