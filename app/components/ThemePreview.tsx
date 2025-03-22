import { ThemeName } from "../types/theme";

interface ThemePreviewProps {
  theme: ThemeName;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  return (
    <div className="w-48 p-4 rounded-lg" data-theme={theme}>
      {/* Mini timer display */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold">25:00</div>
        <div className="text-sm opacity-80">Focus Session</div>
      </div>

      {/* Mini buttons */}
      <div className="space-y-2">
        <button className="btn btn-accent btn-sm w-full">
          Start
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-neutral btn-sm">
            Reset
          </button>
          <button className="btn btn-neutral btn-sm">
            Skip
          </button>
        </div>
      </div>

      {/* Mini player card */}
      <div className="mt-4 bg-base-200 p-2 rounded">
        <div className="w-full aspect-video bg-base-300 rounded mb-2"></div>
        <div className="text-xs truncate">YouTube Player</div>
      </div>
    </div>
  );
}; 