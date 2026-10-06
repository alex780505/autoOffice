import { describe, it, expect, beforeEach } from 'vitest';
import { loadLocale, clearLoaderCache } from './loader.ts';

describe('loader', () => {
  beforeEach(() => clearLoaderCache());

  it('loads en.json and returns a parsed dict', async () => {
    const dict = await loadLocale('en');
    expect((dict as any).common.appName).toBe('AutoOffice');
  });

  it('loads fr.json and returns French strings', async () => {
    const dict = await loadLocale('fr');
    expect((dict as any).common.cancel).toBe('French');
  });

  it('returns the same object reference on repeated calls (cache)', async () => {
    const a = await loadLocale('en');
    const b = await loadLocale('en');
    expect(a).toBe(b);
  });

  it('clearLoaderCache empties the cache so subsequent loads still resolve correctly', async () => {
    await loadLocale('en');
    clearLoaderCache();
    const after = await loadLocale('en');
    expect((after as any).common.appName).toBe('AutoOffice');
  });
});
 