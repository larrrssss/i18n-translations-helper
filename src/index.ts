import { getGithubTranslations } from './github';
import { I18n, Options } from './types';

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

  constructor(locale: string, data?: I18n) {
    this.i18n = data ?? cache;
    this.locale = locale;

    if (!this.i18n)
      throw new Error('Missing translation data. Use loadTranslations().');

    if (!this.i18n[this.locale])
      this.locale = 'en';
  }

  public $t(key: string, payload?: Record<string, string>) {    
    let variable = this._reduceKeyToVariable(key, this.locale) ?? this._reduceKeyToVariable(key, 'en') ?? key;

    for (const match of variable.match(/(?<=\{).+?(?=\})/g) ?? []) {
      if (!payload || !payload[match]) continue;

      variable = variable.split(`{${match}}`).join(payload[match]);
    }

    return variable;
  }

  private _reduceKeyToVariable(key: string, locale = this.locale) {
    const snippets = key.split('.');
    return snippets.reduce<string | null>(function (p, c) {
      return p && typeof p === 'object'
        ? p[c]
        : null;
    }, this.i18n[locale] as any);
  }
}