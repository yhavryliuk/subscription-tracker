import { MonitorCog, MoonStar, Palette, SunMedium } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ThemeMode, isThemeMode } from "@/theme/types";

type ThemeOption = {
  label: string;
  value: ThemeMode;
  Icon: typeof MonitorCog;
};

const options: ThemeOption[] = [
  { label: "System", value: "system", Icon: MonitorCog },
  { label: "Light", value: "light", Icon: SunMedium },
  { label: "Dark", value: "dark", Icon: MoonStar },
  { label: "Colorful", value: "colorful", Icon: Palette },
];

export type ThemeSwitcherProps = {
  value: ThemeMode;
  onValueChange: (nextMode: ThemeMode) => void;
  className?: string;
};

export const ThemeSwitcher = ({
  value,
  onValueChange,
  className,
}: ThemeSwitcherProps) => {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (isThemeMode(nextValue)) {
          onValueChange(nextValue);
        }
      }}
    >
      <SelectTrigger className={className} aria-label="Select theme" size="sm">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {options.map(({ value: optionValue, label, Icon }) => (
            <SelectItem value={optionValue} key={optionValue}>
              <Icon data-icon="inline-start" />
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
