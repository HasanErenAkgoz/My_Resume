import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Lang, Localized, LocalizedNullable } from '../models/cv.model';

const STORAGE_KEY = 'cv-lang';
const DEFAULT_LANG: Lang = 'tr';

/**
 * Single source of truth for the active language. SSR-safe: defaults to TR on
 * the server, then hydrates from localStorage / <html lang> in the browser.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly isBrowser: boolean;
  readonly lang = signal<Lang>(DEFAULT_LANG);

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === 'tr' || stored === 'en') {
        this.lang.set(stored);
      }
      this.syncHtmlLang(this.lang());
    }
  }

  toggle(): void {
    this.set(this.lang() === 'tr' ? 'en' : 'tr');
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    if (this.isBrowser) {
      window.localStorage.setItem(STORAGE_KEY, lang);
      this.syncHtmlLang(lang);
    }
  }

  /** Resolve a bilingual value for the active language. */
  t(value: Localized | LocalizedNullable | undefined | null): string {
    if (!value) {
      return '';
    }
    return value[this.lang()] ?? '';
  }

  private syncHtmlLang(lang: Lang): void {
    this.doc.documentElement.setAttribute('lang', lang);
  }
}
