import {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback
} from "react";
import type { ReactNode } from "react";
import { useTerminalDimensions } from "@opentui/react";
import { type ToastOptions, type ToastVariant, DEFAULT_DURATION } from "./types";

// ToastContext provides a context for managing toast notifications.
export type ToastContextValue = {
    show: (options: ToastOptions) => void;
};

// Create a context for the toast notifications
const ToastContext = createContext<ToastContextValue | null>(null);

// useToast is a custom hook that provides access to the ToastContext.
export function useToast(): ToastContextValue {
    const value = useContext(ToastContext);
    if (!value) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return value;
}

// Props for the ToastProvider component
// which wraps the application and provides the toast notification functionality.
type ToastProviderProps = {
    children: ReactNode;
}

// ToastProvider component that manages the state and display of toast notifications.
export function ToastProvider({ children }: ToastProviderProps) {
    // State to hold the current toast notification
    const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null);

    // timeoutHandleRef to hold the timeout handle for the current toast notification.
    const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null);

    // Clear the current timeout if it exists
    const clearCurrentTimeout = useCallback(() => {
        if (timeoutHandleRef.current) {
            clearTimeout(timeoutHandleRef.current);
            timeoutHandleRef.current = null;
        }
    }, []);

    // Show a new toast notification with the provided options
    const show = useCallback((options: ToastOptions) => {
        const duration = options.duration ?? DEFAULT_DURATION

        clearCurrentTimeout()
        // Set the current toast notification with the provided options
        setCurrentToast({
            variant: options.variant ?? "info",
            message: options.message,
            duration
        })
        // Set a timeout to clear the current toast notification after the specified duration
        timeoutHandleRef.current = setTimeout(() => {
            setCurrentToast(null)
        }, duration).unref()
    }, [clearCurrentTimeout])

    // Create a value object to be provided to the ToastContext
    const value: ToastContextValue = {
        show
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast currentToast={currentToast} />
        </ToastContext.Provider>
    )
}

type ToastProps = {
    currentToast: ToastOptions | null;
}

function Toast({ currentToast }: ToastProps) {
    const { width } = useTerminalDimensions()
    const toastWidth = Math.max(1, Math.min(60, width - 6))

    if (!currentToast) {
        return null
    }

    const variantColors: Record<ToastVariant, string> = {
        success: "#82E0AA",
        error: "#E74C5E",
        info: "#56D6C2"
    }

    const borderColor = variantColors[currentToast.variant ?? "info"]

    return (
        <box
            position="absolute"
            justifyContent="center"
            alignItems="flex-start"
            top={2}
            left={Math.max(0, Math.floor((width - toastWidth) / 2))}
            width={toastWidth}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            backgroundColor="#1A1A24"
            borderColor={borderColor}
            border={["left", "right"]}
        >
            <box flexDirection="column" gap={1} width="100%">
                <text fg="#E1E1E1" wrapMode="word" width="100%">
                    {currentToast.message}
                </text>
            </box>
        </box>
    )
}