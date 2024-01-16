"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SwitchAccount, logUser } from "../services/auth/auth.service";
import { useRouter } from "next/navigation";

interface IAuthContext {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
    img_public_id: string;
    img_signature: string;
    linkedAccounts: {
      id: string;
      userId: string;
      linkedUserId: string;
    }[];
  };
  isLoogedIn: boolean;
  logOut: () => void;
  refetch?: () => void;
  setAccount?: (id: string, token: string) => void;
  token: string;
}

interface IUserData {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
    img_public_id: string;
    img_signature: string;
    linkedAccounts: {
      id: string;
      userId: string;
      linkedUserId: string;
    }[];
  };
  status?: boolean;
}

interface IProps {
  children: React.ReactNode;
  token: string;
}

export const AuthContext = createContext<IAuthContext | null>(null);
export const AuthProvider: React.FC<IProps> = ({ children, token }) => {
  const [data, setData] = useState<IUserData>({});
  const router = useRouter();
  const [truthy, setTruthy] = useState<boolean>(false);
  const logOut = () => {
    localStorage.removeItem("chat-token");
    setData({});
    setTruthy(false);
    router.push("/auth/login");
  };
  const refetch = async () => {
    const data = await logUser(token);
    setData(data);
    setTruthy(true);
  };
  const setAccount = async (id: string, token: string) => {
    const data = await SwitchAccount(id, token);
    if (data.status) {
      window.location.reload();
    }
    setData(data);
    setTruthy(true);
  };

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      const data = await logUser(token);
      setData(data);
      setTruthy(true);
    };
    fetchUser();
  }, []);
  return (
    data && (
      <AuthContext.Provider
        value={{
          user: data.user,
          isLoogedIn: truthy,
          logOut,
          refetch,
          token: token,
          setAccount,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  );
};

export const useAuth = () => {
  const state = useContext(AuthContext);
  if (!state) throw new Error("AuthProvider not found");
  return state;
};
