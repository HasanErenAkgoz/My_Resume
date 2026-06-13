import { Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/services/locale.service';
import { ScanModeService } from '../../core/services/scan-mode.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { UiPipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, UiPipe],
  template: `
    <a class="skip-link" href="#main">{{ 'navSummary' | ui: lang() }}</a>
    <header class="hdr">
      <div class="hdr-inner container">
        <a routerLink="/" class="brand mono" aria-label="Hasan Eren Akgöz">
          <span class="brand-bracket">[</span>HEA<span class="brand-bracket">]</span>
        </a>

        <nav class="nav no-print" aria-label="Primary">
          <a href="#cases">{{ 'navCases' | ui: lang() }}</a>
          <a href="#experience">{{ 'navExperience' | ui: lang() }}</a>
          <a href="#skills">{{ 'navSkills' | ui: lang() }}</a>
          <a href="#contact">{{ 'navContact' | ui: lang() }}</a>
        </nav>

        <div class="actions">
          <button
            type="button"
            class="toggle kbd mono no-print decor-only"
            (click)="ui.togglePalette()"
            aria-label="Open command palette"
          >
            {{ shortcut() }}
          </button>

          <button
            type="button"
            class="toggle mono"
            (click)="locale.toggle()"
            [attr.aria-label]="'Language: ' + lang()"
          >
            <span [class.on]="lang() === 'tr'">TR</span>
            <span class="sep">/</span>
            <span [class.on]="lang() === 'en'">EN</span>
          </button>

          <button
            type="button"
            class="toggle scan mono"
            [class.active]="scan.isScanMode()"
            (click)="scan.toggle()"
            [attr.aria-pressed]="scan.isScanMode()"
          >
            <span class="dot" aria-hidden="true"></span>
            {{ (scan.isScanMode() ? 'exploreMode' : 'scanMode') | ui: lang() }}
          </button>

          <a
            class="btn btn-primary cv-btn"
            href="/assets/cv/HasanErenAkgoz-CV.pdf"
            download
            (click)="onDownload()"
          >
            {{ 'downloadCv' | ui: lang() }}
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .hdr {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(7, 6, 15, 0.72);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--border-soft);
      }
      :host-context(body.scan-mode) .hdr {
        background: #0c0b14;
        backdrop-filter: none;
      }
      .hdr-inner {
        height: var(--header-h);
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .brand {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--text-0);
        letter-spacing: 0.12em;
      }
      .brand-bracket {
        color: var(--neon-cyan);
      }
      .nav {
        display: flex;
        gap: 1.3rem;
        margin-inline: auto;
        font-size: 0.95rem;
      }
      .nav a {
        color: var(--text-1);
      }
      .nav a:hover {
        color: var(--neon-cyan);
      }
      .actions {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-left: auto;
      }
      .toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-soft);
        color: var(--text-2);
        border-radius: 999px;
        padding: 0.4rem 0.7rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
      }
      .toggle:hover {
        border-color: var(--border-strong);
      }
      .toggle .on {
        color: var(--neon-cyan);
        font-weight: 700;
      }
      .toggle .sep {
        opacity: 0.4;
      }
      .scan .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-2);
        box-shadow: none;
      }
      .scan.active {
        color: var(--text-0);
        border-color: var(--border-strong);
      }
      .scan.active .dot {
        background: var(--neon-green);
        box-shadow: 0 0 10px var(--neon-green);
      }
      .kbd {
        color: var(--text-1);
      }
      .kbd:hover {
        color: var(--neon-cyan);
      }
      .cv-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
      @media (max-width: 820px) {
        .nav {
          display: none;
        }
        .toggle.scan span:not(.dot) {
          display: none;
        }
        .kbd {
          display: none;
        }
      }
      @media (max-width: 540px) {
        .cv-btn {
          padding: 0.5rem 0.7rem;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  readonly locale = inject(LocaleService);
  readonly scan = inject(ScanModeService);
  readonly ui = inject(UiStateService);
  private readonly analytics = inject(AnalyticsService);
  readonly lang = this.locale.lang;
  readonly shortcut = signal('⌘K');

  constructor() {
    afterNextRender(() => {
      const isMac = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
      this.shortcut.set(isMac ? '⌘K' : 'Ctrl K');
    });
  }

  onDownload(): void {
    this.analytics.track('pdf_download');
  }
}
