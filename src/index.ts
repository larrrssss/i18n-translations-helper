import { getGithubTranslations } from './github';
import { I18n, I18nProviderOptions, Options } from './types';

let cache: I18n;

export async function loadTranslations(options: Options, forceFetch = false): Promise<I18n> {
  if (cache && !forceFetch)
    return cache;

  if (!options.repository)
    throw new Error('options.repository is required (e.g test-account/repository)');

  try {
    const data = await getGithubTranslations(options);

    cache = data;

    return cache;
  } catch (e) {
    throw new Error(`Error loading translations: ${e}`);
  }
}

export default class I18nProvider {
  i18n: I18n;
  locale: string;
  options?: I18nProviderOptions;

  constructor(locale: string, options?: I18nProviderOptions) {
    this.i18n = options?.data ?? cache;
    this.locale = locale;
    this.options = options;

    if (!this.i18n)
      throw new Error('Missing translation data. Use loadTranslations().');

    if (!this.i18n[this.locale])
      this.locale = 'en';
  }

  public t(key: string, ...payload: string[]) {    
    let variable = this.reduceKeyToVariable(key, this.locale) 
      ?? this.reduceKeyToVariable(key, this.options?.fallbackLanguage ?? 'en') 
      ?? key;

    for (let i = 0; i < payload.length; i += 1) {
      variable = variable.split(`{${i}}`).join(payload[i]);
    }

    return variable;
  }

  private reduceKeyToVariable(key: string, locale = this.locale) {
    const snippets = key.split('.');
    return snippets.reduce<string | null>((p, c) => {
      return p && typeof p === 'object'
        ? p[c]
        : null;
    }, this.i18n[locale] as any);
  }
}