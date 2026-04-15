import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const ensureDirectoryExists = async (directoryPath: string): Promise<void> => {
  await mkdir(directoryPath, { recursive: true });
};

export const readJsonFileSafe = async <T>(
  filePath: string,
  fallbackValue: T
): Promise<T> => {
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return fallbackValue;
    }

    throw new Error(`Failed to read JSON file at '${filePath}'`, {
      cause: error,
    });
  }
};

export const writeJsonFileSafe = async (filePath: string, value: unknown): Promise<void> => {
  await ensureDirectoryExists(path.dirname(filePath));

  try {
    const serialized = JSON.stringify(value, null, 2);
    await writeFile(filePath, `${serialized}\n`, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write JSON file at '${filePath}'`, {
      cause: error,
    });
  }
};

export const readTextFileSafe = async (
  filePath: string,
  fallbackValue = ''
): Promise<string> => {
  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return fallbackValue;
    }

    throw new Error(`Failed to read text file at '${filePath}'`, {
      cause: error,
    });
  }
};

export const writeTextFileSafe = async (filePath: string, content: string): Promise<void> => {
  await ensureDirectoryExists(path.dirname(filePath));

  try {
    await writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write text file at '${filePath}'`, {
      cause: error,
    });
  }
};
