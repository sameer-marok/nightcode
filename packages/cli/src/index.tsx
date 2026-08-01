import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/Header";

function App() {
  return (
    <box alignItems="center" justifyContent="center"
      width="100%" height="100%" gap={2} flexDirection="column">
      <Header />
      <textarea focused placeholder="Enter your text here..." />
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
