import type { RefObject } from "react";
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core";
import { getFilteredCommands } from "./filter-commands";
import { COMMANDS } from "./commands";

const MAX_VISIBLE_ITEMS = 8;

// Align all command names in a  fixed-width column
// so their descriptions are aligned regardless of
//  the length of the command name.
const COMMAND_NAME_WIDTH = Math.max(
  ...COMMANDS.map((cmd) => cmd.name.length)
) + 4;

// Define the props for the CommandMenu component
type CommandMenuProps = {
    query: string;
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>;
    onSelect: (index: number) => void;
    onExecute: (index: number) => void;
};

// Create a command menu that displays a list of commands filtered by the query string
export function CommandMenu({
    query,
    selectedIndex,
    scrollRef,
    onSelect,
    onExecute,
}: CommandMenuProps) {
    const filteredCommands = getFilteredCommands(query);
    // number of visible items in the command menu
    const visibleHeight = Math.min(filteredCommands.length, MAX_VISIBLE_ITEMS);

    if (filteredCommands.length === 0) {
        return (
            <box paddingX = {1}>
                <text attributes={TextAttributes.DIM}>No matching commands</text>
            </box>
        );
    }

    return (
        <scrollbox ref={scrollRef} height={visibleHeight}>
            {filteredCommands.map((cmd, i) => {
                const isSelected = i === selectedIndex

                return (
                    <box
                        key={cmd.value}
                        flexDirection="row"
                        paddingX={1}
                        height={1}
                        overflow="hidden"
                        backgroundColor={isSelected ? "#89B4FA" : undefined}
                        onMouseMove={() => onSelect(i)}
                        onMouseDown={() => onExecute(i)}
                    >   
                        // Command name text
                        <box width={COMMAND_NAME_WIDTH} flexShrink={0}>
                            <text selectable={false} fg={isSelected ? "black" : "white"}>
                                /{cmd.name}
                            </text>
                        </box>
                        // Description text
                        <box flexGrow={1} flexShrink={1} overflow="hidden">
                            <text selectable={false} fg={isSelected ? "black" : "gray"}>
                                /{cmd.description}
                            </text>
                        </box>
                    </box>
                )
            })}
        </scrollbox>
    )
}