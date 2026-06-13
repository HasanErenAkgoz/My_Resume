import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

const CONSENT_KEY = 'cv-analytics-consent';

export type AnalyticsEvent =
  | 'page_view'
  | 'mode_scan'
  | 'mode_explore'
  | 'pdf_download'
  | 'section_view'
  | 'contact_click'
  | 'skip_boot'
  | 'ai_chat_open'
  | 'ai_chat_close';

/**
 * Privacy-first, consent-gated analytics facade.
 *
 * No events are emitted until the visitor accepts cookies. The transport is
 * pluggable: it forwards to a Umami-style `window.umami` if present, otherwise
 * it is a no-op (safe in SSR and in development). This keeps the site KVKK/GDPR
 * compliant by default.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly isBrowser: boolean;
  /** null = not decided yet, true = accepted, false = rejected. */
  readonly consent = signal<boolean | null>(null);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored === 'true') this.consent.set(true);
      else if (stored === 'false') this.consent.set(false);
    }
  }

  setConsent(accepted: boolean): void {
    this.consent.set(accepted);
    if (this.isBrowser) {
      window.localStorage.setItem(CONSENT_KEY, String(accepted));
    }
  }

  track(event: AnalyticsEvent, data?: Record<string, unknown>): void {
    if (!this.isBrowser || this.consent() !== true) {
      return;
    }
    const umami = (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } }).umami;
    if (umami?.track) {
      umami.track(event, data);
    }
  }
}
