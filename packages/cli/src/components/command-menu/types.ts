// Type definitions for command-related functionality
export type CommandContext = {
    exit: () => void;
};

// Type definition for a command
export type Command = {
    name: string;
    description: string;
    value: string;
    action?: (ctx: CommandContext) => void | Promise<void>;
};