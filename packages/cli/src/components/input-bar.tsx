import { useRef, useCallback, useEffect } from "react";
import type { TextareaRenderable } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import type { KeyBinding } from "@opentui/core";
import { StatusBar } from "./status-bar";
import { CommandMenu } from "./command-menu";
import type { Command } from "./command-menu/types";
import { useCommandMenu } from "./command-menu/use-command-menu";
import { useToast } from "../providers/toast";

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
    const renderer = useRenderer();
    const textareaRef = useRef<TextareaRenderable>(null);
    const onSubmitRef = useRef<() => void>(() => {});
    // Access the toast context to show notifications
    const toast = useToast();

    const {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex
    } = useCommandMenu();

    // Wire up textarea submit handler once so it
    // it always reads the latest state
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.onSubmit = () => {
            onSubmitRef.current();
        }
    }, []) //this effect runs only once, after the component is first rendered.

    // Handle command execution when a command is selected from the command menu
    const handleCommand = useCallback((
        command: Command | undefined
    ) => {
        const textarea = textareaRef.current;
        if (!textarea || !command) return;

        textarea.setText("")

        if (command.action) {
            command.action({
                exit: () => renderer.destroy(),
                toast // Pass the toast context to the command action
            });
        } else {
            textarea.insertText(command.value + " ");
        }
    }, [renderer, toast]);

    // Handle the submission of the input text
    const handleSubmit = useCallback(() => {
        if (disabled) return
        
        const textarea = textareaRef.current;
        if (!textarea) return;

        const text = textarea.plainText.trim()
        if (text.length === 0) return

        onSubmit(text)
        textarea.setText("")
    }, [disabled, onSubmit])

    // Update the onSubmitRef to handle command execution or normal submission
    onSubmitRef.current = () => {
        if (disabled) return;

        if (showCommandMenu) {
            const command = resolveCommand(selectedIndex);
            handleCommand(command);
            return
        }

        handleSubmit()
    }

    // Handle content change in the textarea, updating the command menu state accordingly
    const handleTextareaContentChange = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        handleContentChange(textarea.plainText);
    }, [])

    // Handle command execution when a command is selected from the command menu
    const handleCommandExecute = useCallback((index: number) => {
        const command = resolveCommand(index);
        handleCommand(command);
    }, [resolveCommand, handleCommand]);

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
                    { showCommandMenu && (
                        <box
                        position="absolute"
                        bottom="100%"
                        left={0}
                        width="100%"
                        backgroundColor={"#1A1A24"}
                        zIndex={10}
                    >
                        <CommandMenu
                            query={commandQuery}
                            selectedIndex={selectedIndex}
                            scrollRef={scrollRef}
                            onSelect={setSelectedIndex}
                            onExecute={handleCommandExecute}
                        />
                    </box>
                    )}
                    
                    <textarea
                        ref={textareaRef}
                        width="100%"
                        focused={!disabled}
                        keyBindings={TEXTAREA_KEY_BINDINGS}
                        onContentChange={handleTextareaContentChange}
                        placeholder={`Ask anything... "Fix a bug in the database"`}
                    />
                    <StatusBar />
                </box>
            </box>
        </box>
    )
};