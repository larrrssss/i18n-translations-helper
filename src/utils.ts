import fs from 'fs/promises';

export const removePaddedSlashes = (s: string) => {
  s = s.startsWith('/') ? s.slice(1) : s;
  s = s.endsWith('/') ? s.slice(0, -1) : s;
  return s;
};

export const readPathOrThrow = async (p: string) => {
  try {
    const content = await fs.readFile(p);

    return content.toString();
  } catch (e) {
    throw new Error(`${p} does not exist`);
  }
};
