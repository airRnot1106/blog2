'use client';

import { useTheme } from '@wrksz/themes/client';
import type { DefaultTheme } from '@wrksz/themes/client';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ComponentProps, FC } from 'react';

import { Button } from '../../../../components/button/_base/button';
import { Dropdown } from '../../../../components/dropdown/_base/dropdown';

export type SiteThemeSwitchDropdownProps = ComponentProps<typeof Dropdown.Root>;

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const satisfies { value: DefaultTheme; label: string; icon: typeof Sun }[];

export const SiteThemeSwitchDropdown: FC<SiteThemeSwitchDropdownProps> = (props) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const triggerThemeValue = theme === 'system' ? resolvedTheme : theme;
  const TriggerIcon = THEME_OPTIONS.find((option) => option.value === triggerThemeValue)?.icon;

  return (
    <Dropdown.Root {...props}>
      <Dropdown.Trigger
        aria-label="テーマを切り替える"
        render={
          <Button variant="ghost">
            {TriggerIcon && <TriggerIcon aria-hidden="true" size={24} />}
          </Button>
        }
      />
      <Dropdown.Content>
        <Dropdown.RadioGroup value={theme} onValueChange={setTheme}>
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <Dropdown.RadioItem key={value} closeOnClick value={value}>
              <Icon aria-hidden="true" size={16} />
              {label}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.RadioGroup>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
