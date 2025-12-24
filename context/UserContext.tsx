"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  userAvatar: string;
  setUserAvatar: (url: string) => void;
  username: string;
  setUsername: (name: string) => void;
  userId: string; // <--- YENİ: ID alanı
  setUserId: (id: string) => void; // <--- YENİ
}

const defaultState = {
  userAvatar: "/avatars/avatar1.png",
  setUserAvatar: () => {},
  username: "",
  setUsername: () => {},
  userId: "", // <--- YENİ
  setUserId: () => {}, // <--- YENİ
};

const UserContext = createContext<UserContextType>(defaultState);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userAvatar, setUserAvatar] = useState(defaultState.userAvatar);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(""); // <--- YENİ STATE

  return (
    <UserContext.Provider value={{ userAvatar, setUserAvatar, username, setUsername, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);