import type { Command } from "./types";
import { COMMANDS } from "./commands";

// Function to filter commands based on a query string
export function getFilteredCommands(query: string): Command[] {
    // If the query is empty, return all commands
    if (query.length === 0) return COMMANDS; 

    // Filter commands that start with the query string (case-insensitive)
    return COMMANDS.filter((cmd) =>
        cmd.name.toLowerCase().startsWith(query.toLowerCase())
    );
}