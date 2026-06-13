import { Component, afterNextRender, inject, signal } from '@angular/core';
import { LocaleService } from '../../core/services/locale.service';
import { ScanModeService } from '../../core/services/scan-mode.service';
import { AnalyticsService } from '../../core/services/analytics.service';

const SESSION_KEY = 'cv-boot-shown';

const LINES: Record<'tr' | 'en', string[]> = {
  tr: [
    '> sistem başlatılıyor...',
    '> profil yükleniyor: HASAN EREN AKGÖZ',
    '> rol: Full Stack Developer · AI Integration',
    '> deneyim: 4+ yıl · .NET · Angular · OpenAI',
    '> durum: işe açık ✓',
    '> arayüz hazır.',
  ],
  en: [
    '> booting system...',
    '> loading profile: HASAN EREN AKGÖZ',
    '> role: Full Stack Developer · AI Integration',
    '> experience: 4+ yrs · .NET · Angular · OpenAI',
    '> status: open to work ✓',
    '> interface ready.',
  ],
};

/**
 * First-visit terminal boot animation. Shown only in Explore Mode, once per
 * session, and never under Scan Mode or prefers-reduced-motion. Always skippable.
 */
@Component({
  selector: 'app-boot-sequence',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="boot" [class.leaving]="leaving()" role="dialog" aria-label="Intro">
        <div class="terminal mono">
          <div class="bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="ttl">hea&#64;portfolio: ~</span>
          </div>
          <pre class="screen">@for (l of shown(); track $index) {<span class="line">{{ l }}</span>
}<span class="cursor" [class.blink]="done()">█</span></pre>
        </div>
        <button type="button" class="skip mono" (click)="skip()">{{ skipLabel }} →</button>
      </div>
    }
  `,
  styles: [
    `
      .boot {
        position: fixed;
        inset: 0;
        z-index: 200;
        display: grid;
        place-items: center;
        background:
          radial-gradient(800px 600px at 50% 40%, rgba(168, 85, 247, 0.18), transparent 70%),
          #050410;
        transition: opacity 0.6s ease;
      }
      .boot.leaving {
        opacity: 0;
        pointer-events: none;
      }
      .terminal {
        width: min(620px, 90vw);
        border: 1px solid var(--border-strong);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: var(--glow-cyan);
        background: rgba(7, 6, 15, 0.95);
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.6rem 0.9rem;
        background: rgba(255, 255, 255, 0.04);
        border-bottom: 1px solid var(--border-soft);
      }
      .dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
      }
      .dot.r {
        background: #ff5f56;
      }
      .dot.y {
        background: #ffbd2e;
      }
      .dot.g {
        background: #27c93f;
      }
      .ttl {
        margin-left: 0.6rem;
        color: var(--text-2);
        font-size: 0.8rem;
      }
      .screen {
        margin: 0;
        padding: 1.4rem;
        min-height: 220px;
        color: var(--neon-green);
        font-size: 0.95rem;
        line-height: 1.9;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .line {
        display: block;
      }
      .cursor {
        color: var(--neon-green);
      }
      .cursor.blink {
        animation: blink 1s steps(2) infinite;
      }
      @keyframes blink {
        50% {
          opacity: 0;
        }
      }
      .skip {
        margin-top: 1.4rem;
        background: transparent;
        border: 1px solid var(--border-soft);
        color: var(--text-1);
        padding: 0.5rem 1.1rem;
        border-radius: 999px;
        cursor: pointer;
      }
      .skip:hover {
        border-color: var(--border-strong);
        color: var(--neon-cyan);
      }
    `,
  ],
})
export class BootSequenceComponent {
  private readonly locale = inject(LocaleService);
  private readonly scan = inject(ScanModeService);
  private readonly analytics = inject(AnalyticsService);

  readonly visible = signal(false);
  readonly leaving = signal(false);
  readonly done = signal(false);
  readonly shown = signal<string[]>([]);
  readonly skipLabel = this.locale.lang() === 'tr' ? 'Geç' : 'Skip';

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    afterNextRender(() => this.maybeStart());
  }

  private maybeStart(): void {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === '1';
    if (alreadyShown || this.scan.isScanMode() || this.scan.prefersReducedMotion()) {
      return;
    }
    sessionStorage.setItem(SESSION_KEY, '1');
    this.visible.set(true);
    this.play();
  }

  private play(): void {
    const lines = LINES[this.locale.lang()];
    lines.forEach((line, i) => {
      this.timers.push(
        setTimeout(() => {
          this.shown.update((arr) => [...arr, line]);
          if (i === lines.length - 1) {
            this.done.set(true);
            this.timers.push(setTimeout(() => this.finish(), 900));
          }
        }, 380 * (i + 1)),
      );
    });
  }

  skip(): void {
    this.analytics.track('skip_boot');
    this.finish();
  }

  private finish(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.leaving.set(true);
    setTimeout(() => this.visible.set(false), 600);
  }
}
