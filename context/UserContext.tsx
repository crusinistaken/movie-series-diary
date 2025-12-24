"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  userAvatar: string;
  setUserAvatar: (url: string) => void;
  username: string; // <--- YENİ: Kullanıcı Adı
  setUsername: (name: string) => void; // <--- YENİ
}

const defaultState = {
  userAvatar: "/avatars/avatar1.png",
  setUserAvatar: () => {},
  username: "", // Varsayılan boş
  setUsername: () => {},
};

const UserContext = createContext<UserContextType>(defaultState);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userAvatar, setUserAvatar] = useState(defaultState.userAvatar);
  const [username, setUsername] = useState(""); // <--- YENİ STATE

  return (
    <UserContext.Provider value={{ userAvatar, setUserAvatar, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);