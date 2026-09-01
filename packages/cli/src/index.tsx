import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/Header";
import { InputBar } from "./components/input-bar";
import { ToastProvider } from "./providers/toast";

function App() {
  return (
    <ToastProvider>
      <box 
        alignItems="center" 
        justifyContent="center"
        width="100%"
        height="100%" 
        gap={2}
        backgroundColor="#0D0D12"
      >
        <Header />
        <box width="100%" paddingX={2} maxWidth={80}>
          <InputBar onSubmit={() => {}} />
        </box>
      </box>
    </ToastProvider>
    
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false
});
createRoot(renderer).render(<App />);
