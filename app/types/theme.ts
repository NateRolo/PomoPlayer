export type ThemeName = "light" | "dark";

export interface SessionColors {
    background: string;
    text: string;
    textSecondary: string;
    gradient: string;
    button: {
        background: string;
        hover: string;
    };
}

export const getSessionColors = (theme: ThemeName, sessionType: 'work' | 'shortBreak' | 'longBreak'): SessionColors => {
    const baseColors = {
        light: {
            work: {
                background: "bg-base-100",
                text: "text-base-content",
                textSecondary: "text-primary",
                gradient: "from-primary to-primary-focus",
                button: {
                    background: "btn-primary",
                    hover: "hover:btn-primary-focus"
                }
            },
            shortBreak: {
                background: "bg-base-200",
                text: "text-base-content",
                textSecondary: "text-secondary",
                gradient: "from-secondary to-secondary-focus",
                button: {
                    background: "btn-secondary",
                    hover: "hover:btn-secondary-focus"
                }
            },
            longBreak: {
                background: "bg-base-300",
                text: "text-base-content",
                textSecondary: "text-accent",
                gradient: "from-accent to-accent-focus",
                button: {
                    background: "btn-accent",
                    hover: "hover:btn-accent-focus"
                }
            }
        },
        dark: {
            work: {
                background: "bg-neutral",
                text: "text-neutral-content",
                textSecondary: "text-primary",
                gradient: "from-primary to-primary-focus",
                button: {
                    background: "btn-primary",
                    hover: "hover:btn-primary-focus"
                }
            },
            shortBreak: {
                background: "bg-neutral-focus",
                text: "text-neutral-content",
                textSecondary: "text-secondary",
                gradient: "from-secondary to-secondary-focus",
                button: {
                    background: "btn-secondary",
                    hover: "hover:btn-secondary-focus"
                }
            },
            longBreak: {
                background: "bg-base-300",
                text: "text-neutral-content",
                textSecondary: "text-accent",
                gradient: "from-accent to-accent-focus",
                button: {
                    background: "btn-accent",
                    hover: "hover:btn-accent-focus"
                }
            }
        }
    };

    return baseColors[theme] ? baseColors[theme][sessionType] : baseColors.light[sessionType];
};



