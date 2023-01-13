export type TranslationFile = {
  [k: string]: string | Record<string, TranslationFile>,
}

export type I18n = Record<string, TranslationFile>;

export type Options = {
  repository: string,
  branch?: string,
  personalAccessToken?: string,
}

export type I18nProviderOptions = {
  data?: I18n,
  fallbackLanguage?: string,
}