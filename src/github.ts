import axios from 'axios';

import { I18n, Options, TranslationFile } from './types';

const baseUrl = 'https://api.github.com';

async function getGithubTranslationFile(locale: string, {
  repository,
  personalAccessToken,
  branch = 'master',
}: Options): Promise<TranslationFile> {
  const qs = new URLSearchParams({
    ref: branch,
  });

  try {
    const { data: content } = await axios.get(
      `${baseUrl}/repos/${repository}/contents/${locale}/output.json?${qs}`,
      {
        headers: {
          Accept: 'application/vnd.github.raw',
          Authorization: personalAccessToken
            ? `token ${personalAccessToken}`
            : undefined,
        },
      },
    );

    return content;
  } catch (e) {
    throw new Error(`Error fetching output file for ${locale}: ${e}`);
  }
}

export async function getGithubTranslations(options: Options) {
  const { repository, branch = 'master', personalAccessToken } = options;

  const qs = new URLSearchParams({
    ref: branch,
  });

  try {
    const { data: locales } = await axios.get(`${baseUrl}/repos/${repository}/contents/locales.json?${qs}`, {
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