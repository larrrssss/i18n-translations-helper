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

  constructor(locale: string, data: I18n) {
    this.i18n = data;
    this.locale = locale;

    if (!this.i18n[this.locale])
      this.locale = 'en';
  }

  $t(key: string, payload: any) {
    const snippets = key.split('.');

    let variable =  snippets.reduce<string | null>((p, c) => p && typeof p === 'object' ? p[c] : null, this.i18n[this.locale] as any)
      ?? snippets.reduce<string | null>((p, c) => p && typeof p === 'object' ? p[c] : null, this.i18n.en as any)
      ?? key;

    for (const match of variable.match(/(?<=\{).+?(?=\})/) ?? []) {
      if (!payload[match]) continue;

      variable = variable.split(`{${match}}`).join(payload[match]);
    }

    return variable;
  }
}