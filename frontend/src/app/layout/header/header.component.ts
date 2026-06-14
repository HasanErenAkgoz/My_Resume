import { Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CvService } from '../../core/services/cv.service';
import { LocaleService } from '../../core/services/locale.service';
import { ScanModeService } from '../../core/services/scan-mode.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { LocalizePipe, UiPipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, UiPipe, LocalizePipe],
  template: `
    <a class="skip-link" href="#main">{{ 'navSummary' | ui: lang() }}</a>
    <div class="accent-bar decor-only" aria-hidden="true"></div>
    <header class="hdr">
      <div class="hdr-inner container">
        <a routerLink="/" class="brand" [attr.aria-label]="cv.profile.name">
          <span class="brand-name mono">{{ brandName }}</span>
          <span class="brand-role">{{ cv.profile.title | loc: lang() }}</span>
        </a>

        <nav class="nav no-print mono" aria-label="Primary">
          <a href="#summary" class="active">{{ 'navHello' | ui: lang() }}</a>
          <a href="#experience">{{ 'navAbout' | ui: lang() }}</a>
          <a href="#cases">{{ 'navProjects' | ui: lang() }}</a>
          <a href="#skills">{{ 'navSkillsNav' | ui: lang() }}</a>
          <a href="#contact">{{ 'navContactNav' | ui: lang() }}</a>
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
      .accent-bar {
        height: 3px;
        background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), var(--neon-purple));
        box-shadow: 0 0 18px rgba(6, 215, 240, 0.45);
      }
      .hdr {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(7, 6, 15, 0.82);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(6, 215, 240, 0.22);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.35);
      }
      :host-context(body.scan-mode) .hdr {
        background: #0c0b14;
        backdrop-filter: none;
        box-shadow: none;
        border-bottom-color: rgba(255, 255, 255, 0.1);
      }
      :host-context(body.scan-mode) .accent-bar {
        display: none;
      }
      .hdr-inner {
        min-height: var(--header-h);
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-block: 0.65rem;
      }
      .brand {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        flex: 1 1 0;
        min-width: 0;
        overflow: hidden;
        text-decoration: none;
      }
      .brand-name {
        font-weight: 700;
        font-size: clamp(0.95rem, 2.2vw, 1.15rem);
        color: var(--neon-cyan);
        letter-spacing: 0.14em;
        text-transform: uppercase;
        text-shadow: 0 0 16px rgba(6, 215, 240, 0.35);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .brand-role {
        font-size: 0.72rem;
        color: var(--neon-purple);
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 220px;
      }
      .nav {
        display: flex;
        gap: 1.1rem;
        margin-inline: auto;
        font-size: 0.82rem;
      }
      .nav a {
        color: var(--text-2);
        text-decoration: none;
        padding-bottom: 0.2rem;
        border-bottom: 2px solid transparent;
        transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
      }
      .nav a:hover,
      .nav a.active {
        color: var(--neon-cyan);
      }
      .nav a.active {
        border-bottom-color: var(--neon-purple);
        text-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
      }
      .actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: auto;
        flex-shrink: 0;
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
      @media (max-width: 1020px) {
        .nav {
          display: none;
        }
      }
      @media (max-width: 820px) {
        .toggle.scan span:not(.dot) {
          display: none;
        }
        .kbd {
          display: none;
        }
        .brand-role {
          display: none;
        }
      }
      @media (max-width: 540px) {
        .cv-btn {
          display: none;
        }
        .brand-name {
          font-size: 0.82rem;
          letter-spacing: 0.06em;
        }
      }
      @media (max-width: 380px) {
        .toggle.scan {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  private readonly cvService = inject(CvService);
  readonly locale = inject(LocaleService);
  readonly scan = inject(ScanModeService);
  readonly ui = inject(UiStateService);
  private readonly analytics = inject(AnalyticsService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
  readonly shortcut = signal('⌘K');

  get brandName(): string {
    return this.cv.profile.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

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
