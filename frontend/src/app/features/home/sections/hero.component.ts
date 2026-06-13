import { Component, inject } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { LocalizePipe, UiPipe } from '../../../core/i18n/localize.pipe';
import { HrSummaryComponent } from './hr-summary.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LocalizePipe, UiPipe, HrSummaryComponent],
  template: `
    <div class="grid-bg decor-only" aria-hidden="true"></div>
    <div class="nebula decor-only" aria-hidden="true">
      <span class="blob b1"></span>
      <span class="blob b2"></span>
      <span class="blob b3"></span>
    </div>
    <div class="container hero-inner">
      <app-hr-summary />

      <div class="lead">
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
          <button type="button" class="btn btn-ghost ai-cta decor-only" (click)="openChat()">
            <span class="ai-dot" aria-hidden="true"></span>
            {{ lang() === 'tr' ? 'AI ile konuş' : 'Talk to AI' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        position: relative;
        display: block;
        padding-top: clamp(2rem, 5vw, 3.5rem);
        overflow: hidden;
      }
      .grid-bg {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(6, 215, 240, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168, 85, 247, 0.06) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 80%);
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
        opacity: 0.4;
        will-change: transform;
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
      .hero-inner {
        position: relative;
        z-index: 1;
        display: grid;
        gap: 1.6rem;
      }
      .lead {
        max-width: 760px;
      }
      .summary {
        color: var(--text-1);
        font-size: 1.08rem;
      }
      .cta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.7rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class HeroComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  private readonly analytics = inject(AnalyticsService);
  private readonly ui = inject(UiStateService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;

  dl(): void {
    this.analytics.track('pdf_download');
  }

  openChat(): void {
    this.ui.openChat();
    this.analytics.track('ai_chat_open');
  }
}
