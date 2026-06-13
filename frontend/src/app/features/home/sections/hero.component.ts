import { Component, inject } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { ScanModeService } from '../../../core/services/scan-mode.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { LocalizePipe, UiPipe } from '../../../core/i18n/localize.pipe';
import { HrSummaryComponent } from './hr-summary.component';
import { HeroGlobeComponent } from './hero-globe.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LocalizePipe, UiPipe, HrSummaryComponent, HeroGlobeComponent],
  template: `
    <div class="grid-bg decor-only" aria-hidden="true"></div>
    <div class="nebula decor-only" aria-hidden="true">
      <span class="blob b1"></span>
      <span class="blob b2"></span>
      <span class="blob b3"></span>
    </div>

    <div class="container hero-inner">
      @if (scan.isScanMode()) {
        <app-hr-summary />
        <div class="lead scan-lead">
          <p class="summary">{{ cv.profile.summary | loc: lang() }}</p>
          <div class="cta">
            <a class="btn btn-primary" href="/assets/cv/HasanErenAkgoz-CV.pdf" download (click)="dl()">
              ↓ {{ 'downloadCv' | ui: lang() }}
            </a>
            <a class="btn btn-ghost" [href]="cv.profile.contact.linkedin" target="_blank" rel="noopener">
              {{ 'viewLinkedin' | ui: lang() }}
            </a>
            <a class="btn btn-ghost" [href]="cv.profile.contact.github" target="_blank" rel="noopener">
              {{ 'viewGithub' | ui: lang() }}
            </a>
          </div>
        </div>
      } @else {
        <div class="hero-stage">
          <div class="panel-grid">
            <div class="copy">
              <h1 class="headline">
                {{ 'heroHeadlineLead' | ui: lang() }}
                <span class="accent">{{ 'heroHeadlineAccent' | ui: lang() }}</span>
              </h1>
              <p class="code-line mono">{{ 'heroCodeLine' | ui: lang() }}</p>
              <div class="cta">
                <a class="btn btn-outline" href="#cases">
                  {{ 'viewProjects' | ui: lang() }}
                  <span class="arrow" aria-hidden="true">→</span>
                </a>
                <button type="button" class="btn btn-ghost ai-cta decor-only" (click)="openChat()">
                  <span class="ai-dot" aria-hidden="true"></span>
                  {{ lang() === 'tr' ? 'AI ile konuş' : 'Talk to AI' }}
                </button>
                <a class="btn btn-ghost" href="/assets/cv/HasanErenAkgoz-CV.pdf" download (click)="dl()">
                  ↓ {{ 'downloadCv' | ui: lang() }}
                </a>
              </div>
            </div>
            <app-hero-globe />
          </div>

          <div class="stats mono">
            @for (s of stats; track s.labelKey) {
              <div class="stat">
                <span class="stat-icon" aria-hidden="true">{{ s.icon }}</span>
                <span class="stat-value">{{ s.value }}</span>
                <span class="stat-label">{{ s.labelKey | ui: lang() }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        position: relative;
        display: block;
        min-height: calc(100svh - var(--header-h) - 3px);
        overflow: hidden;
      }
      .grid-bg {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(6, 215, 240, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168, 85, 247, 0.08) 1px, transparent 1px);
        background-size: 48px 48px;
        mask-image: radial-gradient(90% 80% at 50% 40%, #000 0%, transparent 92%);
        pointer-events: none;
      }
      .nebula {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
      }
      .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(70px);
        opacity: 0.42;
      }
      .blob.b1 {
        width: 380px;
        height: 380px;
        top: -120px;
        left: -60px;
        background: radial-gradient(circle, rgba(6, 215, 240, 0.5), transparent 70%);
        animation: float1 18s ease-in-out infinite;
      }
      .blob.b2 {
        width: 320px;
        height: 320px;
        top: -40px;
        right: 4%;
        background: radial-gradient(circle, rgba(255, 61, 240, 0.4), transparent 70%);
        animation: float2 22s ease-in-out infinite;
      }
      .blob.b3 {
        width: 300px;
        height: 300px;
        bottom: -120px;
        left: 35%;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.45), transparent 70%);
        animation: float1 26s ease-in-out infinite reverse;
      }
      @keyframes float1 {
        50% {
          transform: translate(40px, 30px) scale(1.1);
        }
      }
      @keyframes float2 {
        50% {
          transform: translate(-50px, 24px) scale(1.08);
        }
      }
      .hero-inner {
        position: relative;
        z-index: 1;
        min-height: inherit;
        display: flex;
        flex-direction: column;
      }
      .hero-stage {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: clamp(1.5rem, 4vw, 2.5rem);
        padding-block: clamp(1.5rem, 4vh, 3rem);
        min-height: calc(100svh - var(--header-h) - 3px);
      }
      .panel-grid {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: clamp(1.5rem, 4vw, 3rem);
        align-items: center;
        flex: 1;
      }
      .copy {
        max-width: 640px;
      }
      .headline {
        font-size: clamp(2rem, 4.8vw, 3.1rem);
        line-height: 1.12;
        margin: 0 0 1.1rem;
        font-weight: 700;
        color: var(--text-0);
      }
      .accent {
        background: linear-gradient(90deg, var(--neon-purple), var(--neon-magenta));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .code-line {
        margin: 0 0 1.4rem;
        color: var(--neon-cyan);
        font-size: 0.95rem;
        text-shadow: 0 0 16px rgba(6, 215, 240, 0.35);
      }
      .cta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.7rem;
      }
      .btn-outline {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 1rem;
        padding: 0.7rem 1.2rem;
        border-radius: var(--radius-sm);
        border: 1px solid rgba(6, 215, 240, 0.55);
        background: rgba(6, 215, 240, 0.06);
        color: var(--text-0);
        text-decoration: none;
        box-shadow: 0 0 20px rgba(6, 215, 240, 0.15);
        transition: all var(--dur) var(--ease);
      }
      .btn-outline:hover {
        border-color: var(--neon-cyan);
        box-shadow: var(--glow-cyan);
        transform: translateY(-2px);
      }
      .arrow {
        color: var(--neon-purple);
      }
      .ai-cta {
        position: relative;
      }
      .ai-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--neon-green);
        box-shadow: 0 0 10px var(--neon-green);
        animation: pulse 1.6s infinite;
      }
      @keyframes pulse {
        50% {
          opacity: 0.4;
        }
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
        padding-top: 1.25rem;
        border-top: 1px solid rgba(6, 215, 240, 0.15);
        margin-top: auto;
      }
      .stat {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.15rem;
      }
      .stat-icon {
        font-size: 1rem;
        line-height: 1;
        filter: drop-shadow(0 0 8px rgba(6, 215, 240, 0.45));
      }
      .stat-value {
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--neon-cyan);
        text-shadow: 0 0 14px rgba(6, 215, 240, 0.35);
      }
      .stat-label {
        font-size: 0.72rem;
        color: var(--text-2);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .scan-lead {
        max-width: 760px;
        margin-top: 1.2rem;
      }
      .summary {
        color: var(--text-1);
        font-size: 1.08rem;
      }
      @media (max-width: 900px) {
        .panel-grid {
          grid-template-columns: 1fr;
        }
        .stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .stats {
          grid-template-columns: 1fr 1fr;
        }
        .stat-value {
          font-size: 1.15rem;
        }
      }
    `,
  ],
})
export class HeroComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  private readonly analytics = inject(AnalyticsService);
  private readonly ui = inject(UiStateService);
  readonly scan = inject(ScanModeService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;

  readonly stats = [
    { icon: '⏱', value: `${this.cv.hrSignals.yearsOfExperience}`, labelKey: 'statYears' as const },
    { icon: '◈', value: `${this.cv.caseStudies.length}`, labelKey: 'statProjects' as const },
    { icon: '⚡', value: `${this.skillCount}`, labelKey: 'statTech' as const },
    { icon: '♥', value: '100%', labelKey: 'statPassion' as const },
  ];

  private get skillCount(): number {
    return this.cv.skills.reduce((n, g) => n + g.items.length, 0);
  }

  dl(): void {
    this.analytics.track('pdf_download');
  }

  openChat(): void {
    this.ui.openChat();
    this.analytics.track('ai_chat_open');
  }
}
