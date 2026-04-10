import { ThemeSwitcher, type ThemeMode } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";

const ThemePreview = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme =
      themeMode === "system" ? (prefersDark ? "dark" : "light") : themeMode;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");

    return () => {
      document.documentElement.dataset.theme = "light";
      document.documentElement.classList.remove("dark");
    };
  }, [themeMode]);

  return (
    <div className="flex flex-col gap-4">
      <ThemeSwitcher value={themeMode} onValueChange={setThemeMode} className="w-36" />
      <p className="text-sm text-muted-foreground">
        Active mode: <span className="font-medium text-foreground">{themeMode}</span>
      </p>
    </div>
  );
};

const meta = {
  title: "Atoms/ThemeSwitcher",
  component: ThemeSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => <ThemePreview />,
};
