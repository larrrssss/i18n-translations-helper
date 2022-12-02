# i18n Translations Helper

Helper module to load translations from a GitHub repository.

## Install

```sh
npm install i18n-translations-helper
```

## Usage

```ts
import I18nProvider, { loadTranslations } from 'i18n-translations-helper';

(async () => {
  const data = await loadTranslations({
    repository: 'me/i18n',
  });

  const i18n = new I18nProvider('de', data);

  const message = i18n.$t('hello.world', { name: 'lars' });
})():
```