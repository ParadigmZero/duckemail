import React, { createContext, useContext, ReactNode, useState } from "react";
import { LocalStorage } from "@raycast/api";

interface AppContextType {
  selectedUser: string | undefined;
  alwaysAskForEmail: boolean;
  deleteUser: (username: string) => Promise<void>;
  addUser: (username: string) => Promise<void>;
  selectUser: (user: string) => Promise<void>;
  unselectUser: () => Promise<void>;
  users: string[];
  fetchAllUsers: () => Promise<void>;
  fetchUser: () => Promise<void>;
  toggleAskForEmail: () => Promise<void>;
  fetchAlwaysAsk: () => Promise<void>;
  isFirst: boolean;
  setNotFirst: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const USER = "USER";
  const ALWAYS_ASK = "ALWAYS_ASK";
  const USERS = "USERS";

  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);
  const [alwaysAskForEmail, setAlwaysAskForEmail] = useState<boolean>(false);

  const [users, setUsers] = useState<string[]>([]);

  function setNotFirst() {
    setIsFirst(false);
  }

  async function deleteUser(username: string): Promise<void> {
    const allUsers: string = (await LocalStorage.getItem(USERS)) ?? "";
    const usersArray: string[] = allUsers.split(",").filter((user) => user !== username);
    const newAllUsers = usersArray.join(",");
    await LocalStorage.setItem(USERS, newAllUsers);
  }

  async function addUser(username: string): Promise<void> {
    let allUsers: string = (await LocalStorage.getItem(USERS)) ?? "";

    if (allUsers.length === 0) {
      await LocalStorage.setItem(USERS, username);
      return;
    }
    allUsers += `,${username}`;
    await LocalStorage.setItem(USERS, allUsers);
  }

  async function selectUser(user: string): Promise<void> {
    setSelectedUser(user);
    await LocalStorage.setItem(USER, user);
  }

  async function unselectUser(): Promise<void> {
    setSelectedUser(undefined);
    await LocalStorage.removeItem(USER);
  }

  async function fetchAlwaysAsk(): Promise<void> {
    setAlwaysAskForEmail(((await LocalStorage.getItem(ALWAYS_ASK)) as boolean | undefined) ?? false);
  }

  async function fetchAllUsers(): Promise<void> {
    const allUsers: string = (await LocalStorage.getItem(USERS)) ?? "";

    if (allUsers.length === 0) {
      setUsers([]);
      return;
    }

    setUsers(allUsers.split(","));
  }

  async function toggleAskForEmail(): Promise<void> {
    await LocalStorage.setItem(ALWAYS_ASK, !alwaysAskForEmail);
    setAlwaysAskForEmail(!alwaysAskForEmail);
  }

  async function fetchUser(): Promise<void> {
    setSelectedUser((await LocalStorage.getItem(USER)) as string | undefined);
  }

  const value = {
    selectedUser,
    alwaysAskForEmail,
    toggleAskForEmail,
    deleteUser,
    addUser,
    selectUser,
    unselectUser,
    users,
    fetchAllUsers,
    fetchUser,
    fetchAlwaysAsk,
    isFirst,
    setNotFirst,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
