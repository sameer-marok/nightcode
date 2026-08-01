import { StatusBar } from "./status-bar";

type Props = {
    onSubmit: (input: string) => void;
    disabled?: boolean;
};

export function InputBar({ onSubmit, disabled }: Props) {
    return (
        <box width="100%" alignItems="center" justifyContent="center">
            <box
                border = {["left"]}
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
                        focused = {!disabled}
                        placeholder={`Ask anything... "Fix a bug in the database"`}
                    />
                    <StatusBar/>
                </box>
            </box>
        </box>
    )
};