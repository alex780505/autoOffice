import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectLocale, normalizeLanguageTag } from './detect.ts';

describe('normalizeLanguageTag', () => {
  it('resolves exact matches', () => {
    expect(normalizeLanguageTag('en')).toBe('en');
    expect(normalizeLanguageTag('fr')).toBe('fr');
  });

  it('lowercases and dashifies', () => {
    expect(normalizeLanguageTag('EN_US')).toBe('en');
    expect(normalizeLanguageTag('FR_FR')).toBe('fr');
  });

  it('strips trailing subtags until a registry hit', () => {
    expect(normalizeLanguageTag('en-GB')).toBe('en');
    expect(normalizeLanguageTag('fr-FR')).toBe('fr');
  });

  it('returns null for unsupported tags', () => {
    expect(normalizeLanguageTag('zz')).toBeNull();
    expect(normalizeLanguageTag('')).toBeNull();
  });
});

describe('detectLocale', () => {
  beforeEach(() => {
    // Each test stubs what it needs; default is "no Office, no preference".
    vi.unstubAllGlobals();
  });

  it('prefers a saved locale that is still in the registry', () => {
    expect(detectLocale({ saved: 'fr' })).toBe('fr');
  });

  it('ignores a saved locale that is no longer registered', () => {
    expect(detectLocale({ saved: 'xx' as any })).toBe('en');
  });

  it('uses Office.context.displayLanguage when no saved value', () => {
    vi.stubGlobal('Office', { context: { displayLanguage: 'fr-FR' } });
    expect(detectLocale({})).toBe('fr');
  });

  it('falls back to navigator.languages', () => {
    vi.stubGlobal('Office', undefined);
    vi.stubGlobal('navigator', { languages: ['fr-FR', 'he-IL', 'en-US'] });
    expect(detectLocale({})).toBe('fr'); // first registry hit wins
  });

  it('falls back to DEFAULT_LOCALE', () => {
    vi.stubGlobal('Office', undefined);
    vi.stubGlobal('navigator', { languages: ['zh-CN'] });
    expect(detectLocale({})).toBe('en');
  });
});
