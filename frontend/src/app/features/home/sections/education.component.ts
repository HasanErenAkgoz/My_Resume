import { Component, inject } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { LocalizePipe, UiPipe } from '../../../core/i18n/localize.pipe';
import { RevealDirective } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [LocalizePipe, UiPipe, RevealDirective],
  template: `
    <div class="container two-col">
      <div appReveal>
        <h2 class="section-title">{{ 'sectionEducation' | ui: lang() }}</h2>
        <ul class="list">
          @for (e of cv.education; track e.school.en) {
            <li class="card glass">
              <div class="row">
                <span class="degree">{{ e.degree | loc: lang() }}</span>
                <span class="period mono">{{ e.period | loc: lang() }}</span>
              </div>
              <p class="field">{{ e.field | loc: lang() }}</p>
              <p class="school mono">{{ e.school | loc: lang() }}</p>
            </li>
          }
        </ul>
      </div>

      <div appReveal>
        <h2 class="section-title">{{ 'sectionLanguages' | ui: lang() }}</h2>
        <ul class="list">
          @for (l of cv.languages; track l.name.en) {
            <li class="card glass lang">
              <span class="degree">{{ l.name | loc: lang() }}</span>
              <span class="lvl chip">{{ l.level | loc: lang() }}</span>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .two-col {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 2rem;
      }
      .list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }
      .card {
        padding: 1rem 1.2rem;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .degree {
        font-family: var(--font-display);
        font-weight: 600;
        color: var(--text-0);
      }
      .period {
        font-size: 0.78rem;
        color: var(--text-2);
      }
      .field {
        margin: 0.3rem 0 0.1rem;
        color: var(--neon-cyan);
        font-size: 0.95rem;
      }
      .school {
        margin: 0;
        color: var(--text-2);
        font-size: 0.82rem;
      }
      .lang {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      @media (max-width: 720px) {
        .two-col {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class EducationComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
}
