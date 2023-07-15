export type TranslationFile = {
  [k: string]: string | Record<string, TranslationFile>;
};

export type I18n = Record<string, TranslationFile>;

export type I18nRessourceOptions = {
  root?: string;
  outputFilePath?: string;
  localesFilePath?: string;
};

export type GithubFetchOptions = {
  repository: string;
  branch?: string;
  personalAccessToken?: string;
} & I18nRessourceOptions;

export type I18nProviderOptions = {
  data?: I18n;
  fallbackLanguage?: string;
};
