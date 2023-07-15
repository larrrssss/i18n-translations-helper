import axios from 'axios';

import { GithubFetchOptions, I18n, TranslationFile } from './types';
import { removePaddedSlashes } from './utils';

const baseUrl = 'https://api.github.com';

async function getGithubTranslationFile(
  locale: string,
  options: GithubFetchOptions,
): Promise<TranslationFile> {
  const {
    repository,
    personalAccessToken,
    branch = 'master',
    root = '',
    outputFilePath = 'output.json',
  } = options;

  const qs = new URLSearchParams({
    ref: branch,
  });

  const url = `${baseUrl}/repos/${repository}/contents/${removePaddedSlashes(
    root,
  )}/${locale}/${removePaddedSlashes(outputFilePath)}`;

  try {
    const { data: content } = await axios.get(`${url}?${qs}`, {
      headers: {
        Accept: 'application/vnd.github.raw',
        Authorization: personalAccessToken
          ? `token ${personalAccessToken}`
          : undefined,
      },
    });

    return content;
  } catch (e) {
    throw new Error(`Error fetching output file for ${locale}: ${e}`);
  }
}

export async function getGithubTranslations(options: GithubFetchOptions) {
  const {
    repository,
    branch = 'master',
    personalAccessToken,
    root = '',
    localesFilePath = 'locales.json',
  } = options;

  const qs = new URLSearchParams({
    ref: branch,
  });

  const url = `${baseUrl}/repos/${repository}/contents/${removePaddedSlashes(
    root,
  )}/${removePaddedSlashes(localesFilePath)}`;

  try {
    const { data: locales } = await axios.get(`${url}?${qs}`, {
      headers: {
        Accept: 'application/vnd.github.raw',
        Authorization: personalAccessToken
          ? `token ${personalAccessToken}`
          : undefined,
      },
    });

    const translations: I18n = {};

    for (const locale of locales) {
      const content = await getGithubTranslationFile(locale, options);

      translations[locale] = content;
    }

    return translations;
  } catch (e) {
    throw new Error(`Error fetching github translation files: ${e}`);
  }
}
