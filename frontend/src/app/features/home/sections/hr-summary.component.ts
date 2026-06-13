import { Component, inject } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { LocalizePipe, UiPipe } from '../../../core/i18n/localize.pipe';

/**
 * The single most important block for recruiters: name, role, current company,
 * stack, HR signals and contact — all visible above the fold, no clicks, no
 * animation dependency. This is what the 6-second scan lands on.
 */
@Component({
  selector: 'app-hr-summary',
  standalone: true,
  imports: [LocalizePipe, UiPipe],
  template: `
    <div class="hr glass holo-edge">
      <div class="photo-wrap">
        <span class="holo-ring decor-only" aria-hidden="true"></span>
        <span class="holo-ring r2 decor-only" aria-hidden="true"></span>
        <div class="photo" aria-hidden="true">
          <img
            [src]="cv.profile.photo"
            [alt]="cv.profile.name"
            width="84"
            height="84"
            (error)="photoOk = false"
            [style.display]="photoOk ? 'block' : 'none'"
          />
          @if (!photoOk) {
            <span class="initials">{{ cv.profile.initials }}</span>
          }
        </div>
      </div>

      <div class="body">
        <div class="row name-row">
          <h1 class="name">{{ cv.profile.name }}</h1>
          @if (cv.hrSignals.openToWork) {
            <span class="badge mono">● {{ 'openToWork' | ui: lang() }}</span>
          }
        </div>
        <p class="title">{{ cv.profile.title | loc: lang() }}</p>

        <ul class="signals mono">
          <li>
            <span class="k">{{ 'lastRole' | ui: lang() }}</span>
            <span class="v">{{ current.company }} · {{ current.period | loc: lang() }}</span>
          </li>
          <li>
            <span class="k">{{ cv.hrSignals.yearsOfExperience }} {{ 'experienceYears' | ui: lang() }}</span>
            <span class="v">{{ cv.hrSignals.location | loc: lang() }}</span>
          </li>
          <li>
            <span class="k">{{ 'workPreference' | ui: lang() }}</span>
            <span class="v">{{ cv.hrSignals.workPreference | loc: lang() }}</span>
          </li>
          <li>
            <span class="k">{{ 'availability' | ui: lang() }}</span>
            <span class="v hl">{{ cv.hrSignals.availability | loc: lang() }}</span>
          </li>
          @if (cv.hrSignals.salaryExpectation.tr) {
            <li>
              <span class="k">₺</span>
              <span class="v">{{ cv.hrSignals.salaryExpectation | loc: lang() }}</span>
            </li>
          }
        </ul>

        <div class="contact mono">
          <a [href]="'mailto:' + cv.profile.contact.email">{{ cv.profile.contact.email }}</a>
          <span class="dot">·</span>
          <a [href]="cv.profile.contact.linkedin" target="_blank" rel="noopener">in/ErenAkgoz</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .hr {
        display: flex;
        gap: 1.4rem;
        padding: 1.5rem 1.6rem;
        align-items: flex-start;
      }
      .photo-wrap {
        position: relative;
        flex: 0 0 84px;
        width: 84px;
        height: 84px;
        perspective: 600px;
      }
      .holo-ring {
        position: absolute;
        inset: -7px;
        border-radius: 20px;
        padding: 2px;
        background: conic-gradient(
          from 0deg,
          var(--neon-cyan),
          var(--neon-magenta),
          var(--neon-purple),
          var(--neon-green),
          var(--neon-cyan)
        );
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        mask-composite: exclude;
        animation: spin 6s linear infinite;
        opacity: 0.9;
      }
      .holo-ring.r2 {
        inset: -12px;
        opacity: 0.25;
        filter: blur(3px);
        animation-duration: 9s;
        animation-direction: reverse;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .photo {
        position: relative;
        width: 84px;
        height: 84px;
        border-radius: 16px;
        overflow: hidden;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, rgba(6, 215, 240, 0.25), rgba(168, 85, 247, 0.25));
        border: 1px solid var(--border-strong);
        transition: transform var(--dur) var(--ease);
      }
      .photo-wrap:hover .photo {
        transform: rotateY(12deg) rotateX(-8deg) scale(1.04);
      }
      .photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .initials {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.7rem;
        color: var(--text-0);
      }
      .body {
        flex: 1;
        min-width: 0;
      }
      .name-row {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-wrap: wrap;
      }
      .name {
        font-size: clamp(1.5rem, 4vw, 2.1rem);
        margin: 0;
      }
      .badge {
        font-size: 0.72rem;
        color: var(--neon-green);
        border: 1px solid rgba(57, 255, 158, 0.4);
        border-radius: 999px;
        padding: 0.2em 0.6em;
      }
      .title {
        color: var(--neon-cyan);
        font-weight: 600;
        margin: 0.2rem 0 0.9rem;
      }
      .signals {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.35rem 1.4rem;
        font-size: 0.84rem;
        margin: 0 0 0.9rem;
      }
      .signals li {
        display: flex;
        flex-direction: column;
      }
      .signals .k {
        color: var(--text-2);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .signals .v {
        color: var(--text-0);
      }
      .signals .v.hl {
        color: var(--neon-green);
      }
      .contact {
        font-size: 0.85rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .contact .dot {
        color: var(--text-2);
      }
      @media (max-width: 560px) {
        .signals {
          grid-template-columns: 1fr;
        }
        .hr {
          padding: 1.2rem;
        }
      }
    `,
  ],
})
export class HrSummaryComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
  readonly current = this.cv.experience[0];
  photoOk = true;
}
