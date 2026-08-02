import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/Header";
import { InputBar } from "./components/input-bar";

function App() {
  return (
    <box 
      alignItems="center" 
      justifyContent="center"
      width="100%"
      height="100%" 
      gap={2}
      backgroundColor="#0D0D12" 
      flexDirection="column">
      <Header />
      <box width="100%" paddingX={2} maxWidth={80}>
        <InputBar onSubmit={() => {}} />
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
