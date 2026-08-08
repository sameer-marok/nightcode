import { useRef, useState, useMemo, type RefObject } from "react";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { getFilteredCommands } from "./filter-commands";
import type { Command } from "./types";

// Custom hook to manage the state and behavior of the command menu.
type UseCommandMenuReturn = {
    showCommandMenu: boolean; // Whether the command menu is currently visible.
    commandQuery: string; // Current text used to filter commands (e.g. "ex" for /exit).
    selectedIndex: number; // Index of the currently highlighted command.
    scrollRef: RefObject<ScrollBoxRenderable | null>; // Reference to the scrollable command list.
    handleContentChange: (text: string) => void; // Updates the query when the user types.
    resolveCommand: (index: number) => Command | undefined; // Returns the command at the given index, if it exists.
    setSelectedIndex: (index: number) => void; // Updates which command is currently selected.
};

export function useCommandMenu(): UseCommandMenuReturn {
    // states for managing the command menu
    const [textValue, setTextValue] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const scrollRef = useRef<ScrollBoxRenderable | null>(null);

    const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

    // useMemo to optimize filtering commands based on the current query
    const filteredCommands = useMemo(() => getFilteredCommands(commandQuery), [commandQuery]);

    const handleContentChange = (text: string) => {
        setTextValue(text); // Update the text value when the user types.
        setSelectedIndex(0); // Reset the selected index to the first command.

        // Jump back to the top of the list when user types a new character
        const scrollBox = scrollRef.current;
        if (scrollBox) {
            scrollBox.scrollTo(0);
        }

        const prefix = text.startsWith("/") ? text.slice(1) : null;
        if (prefix !== null && !prefix.includes(" ")) {
            setShowCommandMenu(true); // Show the command menu if the user types a command prefix.
        } else {
            setShowCommandMenu(false); // Hide the command menu if the input is not a command.
        }

    }

    // resolve a command at a specific index (returns the command, caller handles execution)
    const resolveCommand = (index: number): Command | undefined => {
        const command = filteredCommands[index];

        if (command) {
            setShowCommandMenu(false);
        }

        return command;
    };

    // Arrow keys move selection, list follows along when highlight goes off-screen
    useKeyboard((key) => {
        if (!showCommandMenu) return;

        if (key.name === "escape") {
            key.preventDefault();
            setShowCommandMenu(false);
        } else if (key.name === "up") {
            key.preventDefault();
            setSelectedIndex((i: number) => { // calculating new index
                if (filteredCommands.length === 0) return 0;
                const newIndex = i === 0 ? filteredCommands.length - 1 : i - 1;
                // keep highlighted item visible when arrowing past the edge
                const sb = scrollRef.current;
                if (sb && (i === 0 || newIndex < sb.scrollTop)) {
                    sb.scrollTo(newIndex);
                }
                return newIndex;
            })
        } else if (key.name === "down") {
            key.preventDefault();
            setSelectedIndex((i: number) => { // calculating new index
                if (filteredCommands.length === 0) return 0;
                const newIndex = i === filteredCommands.length - 1 ? 0 : i + 1;
                const sb = scrollRef.current;
                if (sb) {
                    const viewportHeight = sb.viewport.height;
                    const visibleEnd = sb.scrollTop + viewportHeight - 1;
                    if (i === filteredCommands.length - 1) {
                        sb.scrollTo(0);
                    } else if (newIndex > visibleEnd) {
                        sb.scrollTo(newIndex - viewportHeight + 1);
                    }
                }
                return newIndex;
            })
        }
    });

    return {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex,
    };
}