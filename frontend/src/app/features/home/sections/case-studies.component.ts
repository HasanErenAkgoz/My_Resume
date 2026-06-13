import { Component, inject } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { LocalizePipe, UiPipe } from '../../../core/i18n/localize.pipe';
import { RevealDirective } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-case-studies',
  standalone: true,
  imports: [LocalizePipe, UiPipe, RevealDirective],
  template: `
    <div class="container">
      <h2 class="section-title">{{ 'sectionCases' | ui: lang() }}</h2>
      <p class="section-sub">{{ 'sectionCasesSub' | ui: lang() }}</p>

      <div class="grid">
        @for (cs of cv.caseStudies; track cs.id) {
          <article class="card glass glass-hover holo-edge" appReveal>
            <header class="head">
              <span class="badge mono">{{ cs.company }} · {{ cs.period }}</span>
              <h3>{{ cs.title | loc: lang() }}</h3>
            </header>

            <div class="block">
              <span class="label mono">{{ 'problem' | ui: lang() }}</span>
              <p>{{ cs.problem | loc: lang() }}</p>
            </div>
            <div class="block">
              <span class="label mono accent">{{ 'solution' | ui: lang() }}</span>
              <p>{{ cs.solution | loc: lang() }}</p>
            </div>
            <div class="block">
              <span class="label mono green">{{ 'impact' | ui: lang() }}</span>
              <p>{{ cs.impact | loc: lang() }}</p>
            </div>

            <div class="metrics">
              @for (m of cs.metrics; track m.label.en) {
                <div class="metric">
                  <span class="mv">{{ m.value }}</span>
                  <span class="ml mono">{{ m.label | loc: lang() }}</span>
                </div>
              }
            </div>

            <ul class="tech">
              @for (t of cs.tech; track t) {
                <li class="chip">{{ t }}</li>
              }
            </ul>
          </article>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.2rem;
      }
      .card {
        padding: 1.4rem;
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }
      .badge {
        font-size: 0.72rem;
        color: var(--neon-magenta);
        letter-spacing: 0.04em;
      }
      .head h3 {
        font-size: 1.2rem;
        margin: 0.3rem 0 0;
      }
      .block {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .block p {
        margin: 0;
        font-size: 0.92rem;
        color: var(--text-1);
      }
      .label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-2);
      }
      .label.accent {
        color: var(--neon-cyan);
      }
      .label.green {
        color: var(--neon-green);
      }
      .metrics {
        display: flex;
        gap: 1.4rem;
        padding: 0.6rem 0;
        border-block: 1px solid var(--border-soft);
      }
      .metric {
        display: flex;
        flex-direction: column;
      }
      .mv {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.3rem;
        color: var(--text-0);
      }
      .ml {
        font-size: 0.68rem;
        color: var(--text-2);
        text-transform: uppercase;
      }
      .tech {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: auto;
      }
    `,
  ],
})
export class CaseStudiesComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
}
