import React from 'react';
import { HashRouter } from 'react-router-dom';
import { withThemes } from 'storybook-addon-themes';

import { ToasterContextProvider } from 'app/components/Toaster/Context';
import IntlProvider from 'app/contexts/IntlContext';
import { LayoutSettingsContextProvider } from 'app/contexts/LayoutSettingsContext';
import UrqlContextProvider from 'app/contexts/UrqlContext';
import translations from 'app/locales';

import KitsuTheme from './KitsuTheme';

import 'app/styles/index.css';

function getFlagEmoji(countryCode: string) {
  if (countryCode.length === 2) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } else {
    return '';
  }
}

const locales = (() => {
  const language = new Intl.DisplayNames(['en'], { type: 'language' });

  return Object.keys(translations).map((key) => ({
    value: key,
    title: language.of(key),
    right: getFlagEmoji(key.split('-')[1]),
  }));
})();

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Global locale for components',
    defaultValue: 'en-US',
    toolbar: {
      icon: 'globe',
      items: locales,
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  themes: {
    clearable: false,
    default: 'light',
    list: [
      { name: 'light', class: 'theme-light', color: '#f7f7f7' },
      { name: 'dark', class: 'theme-dark', color: '#443443' },
      { name: 'oled', class: 'theme-oled', color: '#000000' },
    ],
  },
  docs: { theme: KitsuTheme },
};

export const decorators = [
  withThemes,
  (
    Story: React.ComponentType,
    { globals: { locale } }: { globals: { locale: string } }
  ) => (
    <React.StrictMode>
      <React.Suspense fallback={null}>
        <LayoutSettingsContextProvider>
          <HashRouter>
            <IntlProvider locale={locale}>
              <UrqlContextProvider>
                <ToasterContextProvider>
                  <Story />
                </ToasterContextProvider>
              </UrqlContextProvider>
            </IntlProvider>
          </HashRouter>
        </LayoutSettingsContextProvider>
      </React.Suspense>
    </React.StrictMode>
  ),
];
