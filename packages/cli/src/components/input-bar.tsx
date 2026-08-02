import type { KeyBinding } from "@opentui/core";
import { StatusBar } from "./status-bar";

type Props = {
    onSubmit: (input: string) => void;
    disabled?: boolean;
};

// Key bindings for the textarea component
export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
    { name: "return", action: "submit" },
    { name: "enter", action: "submit" },
    { name: "return", shift: true, action: "newline" },
    { name: "enter", shift: true, action: "newline" },
]

export function InputBar({ onSubmit, disabled }: Props) {
    return (
        <box width="100%" alignItems="center" justifyContent="center">
            <box
                width="100%"
                border={["left"]}
                borderColor={"cyan"}
            >
                <box
                    position="relative"
                    justifyContent="center"
                    paddingX={2}
                    paddingY={1}
                    backgroundColor={"#1A1A24"}
                    width="100%"
                    gap={1}
                >
                    <textarea
                        width="100%"
                        focused={!disabled}
                        keyBindings={TEXTAREA_KEY_BINDINGS}
                        placeholder={`Ask anything... "Fix a bug in the database"`}
                    />
                    <StatusBar />
                </box>
            </box>
        </box>
    )
};