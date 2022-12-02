export type TranslationFile = {
  [k: string]: string | Record<string, TranslationFile>,
}

export type I18n = Record<string, TranslationFile>;

export type Options = {
  repository: string,
  branch?: string,
  personalAccessToken?: string,
}