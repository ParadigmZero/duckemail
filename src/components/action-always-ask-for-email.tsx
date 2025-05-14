import { Action, Icon } from "@raycast/api";
import { useAppContext } from "../context/AppContext";

export default function ActionAlwaysAskForEmail() {
  const { alwaysAskForEmail, toggleAskForEmail } = useAppContext();

  return (
    <Action
      icon={Icon.Gear}
      title={alwaysAskForEmail ? "Don't Always Ask for Email" : "Always Ask for Email"}
      shortcut={{ modifiers: ["cmd"], key: "s" }}
      onAction={() => {
        toggleAskForEmail();
      }}
    />
  );
}
