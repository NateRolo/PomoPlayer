export type Theme = {
    name: string;
    work: {
        background: string;
        text: string;
        gradient: string;
        button: {
            background: string;
            hover: string;
        };
    };
    shortBreak: {
        background: string;
        text: string;
        gradient: string;
        button: {
            background: string;
            hover: string;
        };
    };
    longBreak: {
        background: string;
        text: string;
        gradient: string;
        button: {
            background: string;
            hover: string;
        };
    };
}

export const themes: Record<string, Theme> = {
    default: {
        name: "Default",
        work: {
            background: "bg-gradient-to-br from-red-50 to-red-100",
            text: "text-red-700",
            gradient: "from-red-500 to-red-700",
            button: {
                background: "bg-red-500",
                hover: "hover:bg-red-600"
            }
        },
        shortBreak: {
            background: "bg-gradient-to-br from-blue-50 to-blue-100",
            text: "text-blue-700",
            gradient: "from-blue-500 to-blue-700",
            button: {
                background: "bg-blue-500",
                hover: "hover:bg-blue-600"
            }
        },
        longBreak: {
            background: "bg-gradient-to-br from-purple-50 to-purple-100",
            text: "text-purple-700",
            gradient: "from-purple-500 to-purple-700",
            button: {
                background: "bg-purple-500",
                hover: "hover:bg-purple-600"
            }
        }
    },
    forest: {
        name: "Forest",
        work: {
            background: "bg-gradient-to-br from-emerald-50 to-emerald-100",
            text: "text-emerald-700",
            gradient: "from-emerald-500 to-emerald-700", 
            button: {
                background: "bg-emerald-500",
                hover: "hover:bg-emerald-600"
            }
        },
        shortBreak: {
            background: "bg-gradient-to-br from-teal-100 to-teal-200",
            text: "text-teal-800",
            gradient: "from-teal-600 to-teal-800",
            button: {
                background: "bg-teal-500",
                hover: "hover:bg-teal-600"
            }
        },
        longBreak: {
            background: "bg-gradient-to-br from-green-100 to-green-200", 
            text: "text-green-800",
            gradient: "from-green-600 to-green-800",
            button: {
                background: "bg-green-500",
                hover: "hover:bg-green-600"
            }
        }
    },
    ocean: {
        name: "Ocean",
        work: {
            background: "bg-gradient-to-br from-cyan-50 to-cyan-100",
            text: "text-cyan-700",
            gradient: "from-cyan-500 to-cyan-700",
            button: {
                background: "bg-cyan-500",
                hover: "hover:bg-cyan-600"
            }
        },
        shortBreak: {
            background: "bg-gradient-to-br from-sky-50 to-sky-100",
            text: "text-sky-700",
            gradient: "from-sky-500 to-sky-700",
            button: {
                background: "bg-sky-500",
                hover: "hover:bg-sky-600"
            }
        },
        longBreak: {
            background: "bg-gradient-to-br from-blue-50 to-blue-100",
            text: "text-blue-700",
            gradient: "from-blue-500 to-blue-700",
            button: {
                background: "bg-blue-500",
                hover: "hover:bg-blue-600"
            }
        }
    },
    darkMode: {
        name: "Dark Mode",
        work: {
            background: "bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A]",
            text: "text-[#F5F5F5]",
            gradient: "from-[#9333EA] to-[#7C3AED]",
            button: {
                background: "bg-[#9333EA]",
                hover: "hover:bg-[#7C3AED]"
            }
        },
        shortBreak: {
            background: "bg-gradient-to-br from-[#1F1F1F] to-[#141414]",
            text: "text-[#E5E5E5]",
            gradient: "from-[#3B82F6] to-[#2563EB]",
            button: {
                background: "bg-[#3B82F6]",
                hover: "hover:bg-[#2563EB]"
            }
        },
        longBreak: {
            background: "bg-gradient-to-br from-[#171717] to-[#0F0F0F]",
            text: "text-[#D1D1D1]",
            gradient: "from-[#10B981] to-[#059669]",
            button: {
                background: "bg-[#10B981]",
                hover: "hover:bg-[#059669]"
            }
        }
    }
} 