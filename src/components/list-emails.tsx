import { useEffect, useState } from "react";
import { ActionPanel, Action, List, Icon } from "@raycast/api";
import { useAppContext } from "../context/AppContext";
import ActionAlwaysAskForEmail from "./action-always-ask-for-email";

const emailUsernameValidRegex = /^[a-zA-Z0-9._%+-]+$/;

function isValidEmailUsername(username: string): boolean {
  return emailUsernameValidRegex.test(username);
}

export default function ListEmails() {
  const { fetchAllUsers, users, addUser, deleteUser, selectUser, setNotFirst } = useAppContext();

  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    refreshUsers();
  }, []);

  function refreshUsers() {
    fetchAllUsers();
  }

  function formatAndSetEmailUsernameText(text: string): void {
    setSearchText(
      text
        .trim()
        .replace(/@.*$/, "")
        .replace(/[^a-zA-Z0-9._%+-]/g, ""),
    );
  }

  return (
    <List
      filtering={true}
      onSearchTextChange={(value) => {
        formatAndSetEmailUsernameText(value);
      }}
      searchText={searchText}
      navigationTitle="Choose/add your @duck.com email"
      searchBarPlaceholder=""
    >
      {isValidEmailUsername(searchText) && !users.includes(searchText) ? (
        <List.Item
          key={searchText}
          id={searchText}
          title={searchText}
          subtitle="@duck.com - CREATE"
          icon={Icon.Plus}
          actions={
            <ActionPanel>
              <Action.SubmitForm
                title="Add Email"
                icon={Icon.AddPerson}
                onSubmit={async () => {
                  await addUser(searchText);
                  await fetchAllUsers();
                }}
              />
            </ActionPanel>
          }
        />
      ) : null}

      {users.map((user) => (
        <List.Item
          key={user}
          id={user}
          title={`${user}`}
          subtitle="@duck.com"
          actions={
            <ActionPanel>
              <Action.SubmitForm
                title="Select"
                icon={Icon.CheckCircle}
                onSubmit={async () => {
                  setNotFirst();
                  selectUser(user);
                }}
              />

              <ActionAlwaysAskForEmail />

              <Action.SubmitForm
                title="Delete"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                onSubmit={async () => {
                  await deleteUser(user);
                  refreshUsers();
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
