import type { Command } from "./types";

export const COMMANDS : Command[] = [
    {
        name: "new",
        description: "Start a new conversation",
        value: "/new",
    },
    {
        name: "exit",
        description: "Quit the application",
        value: "/exit",
        action: (ctx) => {
            ctx.exit();
        },
    },
    {
        name: "new2",
        description: "Start a new conversation",
        value: "/new2",
    },
    {
        name: "new3",
        description: "Start a new conversation",
        value: "/new3",
    },
    {
        name: "new4",
        description: "Start a new conversation",
        value: "/new4",
    },
];