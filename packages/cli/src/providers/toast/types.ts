// ToastVariant defines the possible variants for a toast notification.
export type ToastVariant = "success" | "error" | "info";

// ToastOptions defines the options for displaying a toast notification.
export type ToastOptions = {
    message: string;
    variant?: ToastVariant;
    duration?: number
};

export const DEFAULT_DURATION = 3000