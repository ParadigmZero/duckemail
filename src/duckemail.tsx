import Launch from "./components/launch";
import { AppContextProvider } from "./context/AppContext";

export default function Command() {
  return (
    <AppContextProvider>
      <Launch />
    </AppContextProvider>
  );
}
