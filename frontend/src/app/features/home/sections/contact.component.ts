import { Component, inject } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { UiPipe } from '../../../core/i18n/localize.pipe';
import { RevealDirective } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [UiPipe, RevealDirective],
  template: `
    <div class="container" appReveal>
      <h2 class="section-title">{{ 'sectionContact' | ui: lang() }}</h2>
      <p class="section-sub">{{ 'sectionContactSub' | ui: lang() }}</p>

      <div class="cards">
        <a
          class="card glass glass-hover holo-edge"
          [href]="'mailto:' + cv.profile.contact.email"
          (click)="track()"
        >
          <span class="ic mono">&#64;</span>
          <span class="lbl">{{ 'emailMe' | ui: lang() }}</span>
          <span class="val mono">{{ cv.profile.contact.email }}</span>
        </a>
        <a
          class="card glass glass-hover holo-edge"
          [href]="cv.profile.contact.linkedin"
          target="_blank"
          rel="noopener"
          (click)="track()"
        >
          <span class="ic mono">in</span>
          <span class="lbl">{{ 'viewLinkedin' | ui: lang() }}</span>
          <span class="val mono">/ErenAkgoz</span>
        </a>
        <a
          class="card glass glass-hover holo-edge"
          [href]="cv.profile.contact.github"
          target="_blank"
          rel="noopener"
          (click)="track()"
        >
          <span class="ic mono">{{ '{ }' }}</span>
          <span class="lbl">{{ 'viewGithub' | ui: lang() }}</span>
          <span class="val mono">/ErenAkgoz</span>
        </a>
        <a class="card glass glass-hover holo-edge" [href]="'tel:' + cv.profile.contact.phone">
          <span class="ic mono">☏</span>
          <span class="lbl">{{ 'callMe' | ui: lang() }}</span>
          <span class="val mono">{{ cv.profile.contact.phone }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .card {
        padding: 1.4rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .ic {
        font-size: 1.4rem;
        color: var(--neon-cyan);
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: rgba(6, 215, 240, 0.1);
        border: 1px solid var(--border-soft);
      }
      .lbl {
        font-family: var(--font-display);
        font-weight: 600;
        color: var(--text-0);
        margin-top: 0.3rem;
      }
      .val {
        font-size: 0.82rem;
        color: var(--text-2);
        word-break: break-all;
      }
    `,
  ],
})
export class ContactComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  private readonly analytics = inject(AnalyticsService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;

  track(): void {
    this.analytics.track('contact_click');
  }
}
