import { describe, it, expect } from 'vitest';
import {
  LOCALES,
  DEFAULT_LOCALE,
  isLocaleId,
  getLocaleMeta,
  availableLocales,
} from './registry.ts';

describe('registry', () => {
  it('exposes en and he locales with correct metadata', () => {
    expect(LOCALES.en.direction).toBe('ltr');
    expect(LOCALES.en.fallback).toBeNull();
    expect(LOCALES.en.nativeName).toBe('English');
    expect(LOCALES.fr.direction).toBe('ltr');
    expect(LOCALES.fr.fallback).toBe('en');
    expect(LOCALES.fr.nativeName).toBe('French');
  });

  it('default locale is en', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('isLocaleId narrows valid ids', () => {
    expect(isLocaleId('en')).toBe(true);
    expect(isLocaleId('fr')).toBe(true);
    expect(isLocaleId('xx')).toBe(false);
    expect(isLocaleId('')).toBe(false);
  });

  it('getLocaleMeta returns metadata for a known id', () => {
    expect(getLocaleMeta('fr').direction).toBe('ltr');
  });

  it('availableLocales returns all registered locales as { id, ...meta } rows', () => {
    const list = availableLocales();
    expect(list.map(l => l.id).sort()).toEqual(['en', 'fr']);
    expect(list.find(l => l.id === 'fr')!.nativeName).toBe('French');
  });

  it('every fallback (when set) points at another registered locale', () => {
    for (const [id, meta] of Object.entries(LOCALES)) {
      if (meta.fallback !== null) {
        expect(meta.fallback in LOCALES, `${id}.fallback=${meta.fallback}`).toBe(true);
      }
    }
  });
});
