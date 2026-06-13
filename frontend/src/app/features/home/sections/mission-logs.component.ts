import { Component, inject, signal } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { LocalizePipe, UiPipe } from '../../../core/i18n/localize.pipe';
import { RevealDirective } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-mission-logs',
  standalone: true,
  imports: [LocalizePipe, UiPipe, RevealDirective],
  template: `
    <div class="container">
      <h2 class="section-title">{{ 'sectionExperience' | ui: lang() }}</h2>
      <p class="section-sub">experience.log — {{ cv.experience.length }} entries</p>

      <ol class="timeline">
        @for (exp of cv.experience; track exp.company; let i = $index) {
          <li class="entry" appReveal>
            <span class="node" [class.live]="exp.current" aria-hidden="true"></span>
            <div class="card glass glass-hover">
              <div class="top">
                <div>
                  <h3 class="company">{{ exp.company }}</h3>
                  <p class="role">{{ exp.role | loc: lang() }} · {{ exp.location | loc: lang() }}</p>
                </div>
                <span class="period mono" [class.live]="exp.current">
                  {{ exp.period | loc: lang() }}
                </span>
              </div>

              <ul class="bullets">
                @for (h of exp.highlights; track $index) {
                  <li><span class="marker" aria-hidden="true">▹</span>{{ h | loc: lang() }}</li>
                }
              </ul>

              @if (exp.detail) {
                @if (expanded() === i) {
                  <p class="detail">{{ exp.detail | loc: lang() }}</p>
                }
                <button type="button" class="more mono" (click)="toggle(i)">
                  {{ (expanded() === i ? 'readLess' : 'readMore') | ui: lang() }}
                </button>
              }

              <ul class="tech">
                @for (t of exp.tech; track t) {
                  <li class="chip">{{ t }}</li>
                }
              </ul>
            </div>
          </li>
        }
      </ol>
    </div>
  `,
  styles: [
    `
      .timeline {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        padding-left: 1.6rem;
      }
      .timeline::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 6px;
        bottom: 6px;
        width: 2px;
        background: linear-gradient(180deg, var(--neon-cyan), var(--neon-purple), transparent);
        opacity: 0.5;
      }
      .entry {
        position: relative;
      }
      .node {
        position: absolute;
        left: -1.6rem;
        top: 1.4rem;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--bg-2);
        border: 2px solid var(--neon-purple);
      }
      .node.live {
        background: var(--neon-green);
        border-color: var(--neon-green);
        box-shadow: 0 0 12px var(--neon-green);
      }
      .card {
        padding: 1.3rem 1.4rem;
      }
      .top {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 0.7rem;
      }
      .company {
        font-size: 1.2rem;
        margin: 0;
      }
      .role {
        color: var(--neon-cyan);
        margin: 0.1rem 0 0;
        font-size: 0.92rem;
      }
      .period {
        font-size: 0.8rem;
        color: var(--text-2);
        white-space: nowrap;
      }
      .period.live {
        color: var(--neon-green);
      }
      .bullets {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        margin-bottom: 0.9rem;
      }
      .bullets li {
        display: flex;
        gap: 0.55rem;
        font-size: 0.92rem;
        color: var(--text-1);
      }
      .marker {
        color: var(--neon-cyan);
        flex: 0 0 auto;
      }
      .detail {
        font-size: 0.9rem;
        color: var(--text-2);
        border-left: 2px solid var(--border-strong);
        padding-left: 0.8rem;
      }
      .more {
        background: none;
        border: none;
        color: var(--neon-cyan);
        cursor: pointer;
        font-size: 0.82rem;
        padding: 0;
        margin-bottom: 0.7rem;
      }
      .tech {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }
    `,
  ],
})
export class MissionLogsComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
  readonly expanded = signal<number | null>(null);

  toggle(i: number): void {
    this.expanded.set(this.expanded() === i ? null : i);
  }
}
