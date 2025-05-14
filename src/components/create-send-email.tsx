import { useEffect, useState } from "react";
import { ActionPanel, Form, Action, popToRoot, Icon } from "@raycast/api";
import { useAppContext } from "../context/AppContext";
import ActionAlwaysAskForEmail from "./action-always-ask-for-email";

const emailValidRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string): boolean {
  return emailValidRegex.test(email);
}

export default function CreateSendEmail() {
  const { selectedUser, unselectUser, setNotFirst } = useAppContext();

  useEffect(() => {
    setNotFirst();
  }, []);

  const [emailText, setEmailText] = useState("");

  function convertEmail(text: string): string {
    return isValidEmail(text) ? `${text.replace(/@/g, "_at_")}_${selectedUser}@duck.com` : "Invalid email address";
  }

  return (
    <Form
      actions={
        <ActionPanel>
          {isValidEmail(emailText) ? (
            <Action.CopyToClipboard
              onCopy={() => popToRoot({ clearSearchBar: true })}
              content={convertEmail(emailText)}
            />
          ) : null}

          <Action
            title="Change Email"
            icon={Icon.TwoPeople}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => {
              unselectUser();
            }}
          />

          <ActionAlwaysAskForEmail />
        </ActionPanel>
      }
    >
      <Form.Description text={`From: ${selectedUser}@duck.com`} />

      <Form.Description text="To:" />
      <Form.TextField
        id="text"
        error={
          emailText.length === 0
            ? "enter recipient email"
            : isValidEmail(emailText)
              ? undefined
              : "invalid recipient email"
        }
        value={emailText}
        onChange={(value) => {
          setEmailText(value.trim());
        }}
      />
      <Form.Description text={isValidEmail(emailText) ? "✉️\n" + convertEmail(emailText) : ""} />
    </Form>
  );
}
