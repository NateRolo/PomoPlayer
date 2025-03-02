export type ThemeName = "light" | "dark" | "cupcake" | "forest";
export type SessionType = 'work' | 'shortBreak' | 'longBreak';

// Common color structure that applies to all session types
export interface ColorSet {
    // Base colors
    base: {
        100: string;
        200: string;
        300: string;
        content: string;
    };
    // Main colors
    primary: {
        bg: string;
        text: string;
        focus: string;
        content: string;
    };
    secondary: {
        bg: string;
        text: string;
        focus: string;
        content: string;
    };
    accent: {
        bg: string;
        text: string;
        focus: string;
        content: string;
    };
    neutral: {
        bg: string;
        text: string;
        focus: string;
        content: string;
    };
    // State colors
    info: {
        bg: string;
        text: string;
        content: string;
    };
    success: {
        bg: string;
        text: string;
        content: string;
    };
    warning: {
        bg: string;
        text: string;
        content: string;
    };
    error: {
        bg: string;
        text: string;
        content: string;
    };
}

// Session-specific styling
export interface SessionColors extends ColorSet {
    // Session-specific elements
    background: string;
    text: string;
    textSecondary: string;
    button: {
        background: string;
        hover: string;
        text: string;
    };
}

// DaisyUI common colors that don't change with session type
const daisyuiColors: ColorSet = {
    base: {
        100: "bg-base-100",
        200: "bg-base-200",
        300: "bg-base-300",
        content: "text-base-content"
    },
    primary: {
        bg: "bg-primary",
        text: "text-primary",
        focus: "bg-primary-focus",
        content: "text-primary-content"
    },
    secondary: {
        bg: "bg-secondary",
        text: "text-secondary",
        focus: "bg-secondary-focus",
        content: "text-secondary-content"
    },
    accent: {
        bg: "bg-accent",
        text: "text-accent",
        focus: "bg-accent-focus",
        content: "text-accent-content"
    },
    neutral: {
        bg: "bg-neutral",
        text: "text-neutral",
        focus: "bg-neutral-focus",
        content: "text-neutral-content"
    },
    info: {
        bg: "bg-info",
        text: "text-info",
        content: "text-info-content"
    },
    success: {
        bg: "bg-success",
        text: "text-success",
        content: "text-success-content"
    },
    warning: {
        bg: "bg-warning",
        text: "text-warning",
        content: "text-warning-content"
    },
    error: {
        bg: "bg-error",
        text: "text-error",
        content: "text-error-content"
    }
};

export const getSessionColors = (theme: ThemeName, sessionType: SessionType): SessionColors => {
    // Session-specific configurations
    const sessionConfigs = {
        work: {
            background: daisyuiColors.base[100],
            text: daisyuiColors.base.content,
            textSecondary: daisyuiColors.primary.text,
            button: {
                background: "btn-primary",
                hover: "hover:bg-primary-focus",
                text: daisyuiColors.primary.content
            }
        },
        shortBreak: {
            background: daisyuiColors.base[300],
            text: daisyuiColors.base.content,
            textSecondary: daisyuiColors.secondary.text,
            button: {
                background: "btn-secondary",
                hover: "hover:bg-secondary-focus",
                text: daisyuiColors.secondary.content
            }
        },
        longBreak: {
            background: daisyuiColors.base[300],
            text: daisyuiColors.base.content,
            textSecondary: daisyuiColors.accent.text,
            button: {
                background: "btn-accent",
                hover: "hover:bg-accent-focus",
                text: daisyuiColors.accent.content
            }
        }
    };

    // Combine common colors with session-specific styling
    return {
        ...daisyuiColors,
        ...sessionConfigs[sessionType]
    };
};



