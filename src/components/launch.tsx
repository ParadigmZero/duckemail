import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ListEmails from "./list-emails";
import CreateSendEmail from "./create-send-email";

export default function Launch() {
  const { fetchAlwaysAsk, fetchUser, alwaysAskForEmail, selectedUser, isFirst } = useAppContext();

  useEffect(() => {
    const initializeApp = async () => {
      await fetchAlwaysAsk();

      await fetchUser();
    };

    initializeApp();
  }, []);

  return isFirst ? (
    selectedUser ? (
      alwaysAskForEmail ? (
        <ListEmails />
      ) : (
        <CreateSendEmail />
      )
    ) : (
      <ListEmails />
    )
  ) : selectedUser ? (
    <CreateSendEmail />
  ) : (
    <ListEmails />
  );
}
