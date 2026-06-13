import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AnalyticsService } from './analytics.service';

const STORAGE_KEY = 'cv-mode';

/**
 * Controls Scan Mode (HR-friendly, animation-free) vs Explore Mode (the full
 * holographic experience).
 *
 * Priority on load: `?mode=scan` query param  >  prefers-reduced-motion  >
 * localStorage  >  default (Explore).
 *
 * Toggling updates the URL via history.replaceState (no navigation) so the
 * current view is always shareable from the address bar.
 */
@Injectable({ providedIn: 'root' })
export class ScanModeService {
  private readonly isBrowser: boolean;
  readonly isScanMode = signal<boolean>(false);
  readonly prefersReducedMotion = signal<boolean>(false);

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private readonly doc: Document,
    private readonly analytics: AnalyticsService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initFromEnvironment();
    }
  }

  toggle(): void {
    this.setScanMode(!this.isScanMode());
  }

  setScanMode(enabled: boolean, opts: { track?: boolean } = { track: true }): void {
    this.isScanMode.set(enabled);
    this.applyBodyClass(enabled);
    if (this.isBrowser) {
      window.localStorage.setItem(STORAGE_KEY, enabled ? 'scan' : 'explore');
      this.syncUrl(enabled);
      if (opts.track) {
        this.analytics.track(enabled ? 'mode_scan' : 'mode_explore');
      }
    }
  }

  private initFromEnvironment(): void {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.prefersReducedMotion.set(reduced);

    let enabled: boolean;
    if (urlMode === 'scan') {
      enabled = true;
    } else if (urlMode === 'explore') {
      enabled = false;
    } else if (reduced) {
      enabled = true;
    } else {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      enabled = stored === 'scan';
    }
    // Initialize without tracking and without rewriting an explicit URL choice.
    this.isScanMode.set(enabled);
    this.applyBodyClass(enabled);
  }

  private syncUrl(enabled: boolean): void {
    const url = new URL(window.location.href);
    if (enabled) {
      url.searchParams.set('mode', 'scan');
    } else {
      url.searchParams.delete('mode');
    }
    window.history.replaceState({}, '', url);
  }

  private applyBodyClass(enabled: boolean): void {
    const body = this.doc.body;
    body.classList.toggle('scan-mode', enabled);
    body.classList.toggle('explore-mode', !enabled);
  }
}
