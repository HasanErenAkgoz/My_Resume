import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { ScanModeService } from '../../../core/services/scan-mode.service';
import { LocalizePipe, UiPipe } from '../../../core/i18n/localize.pipe';
import { RevealDirective } from '../../../shared/reveal.directive';
import { SkillConstellationComponent } from './skill-constellation.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [LocalizePipe, UiPipe, RevealDirective, SkillConstellationComponent],
  template: `
    <div class="container">
      <div class="head">
        <div>
          <h2 class="section-title">{{ 'sectionSkills' | ui: lang() }}</h2>
          <p class="section-sub">{{ show3d() ? 'constellation --3d · hover nodes' : 'stack --list' }}</p>
        </div>
        @if (!scan.isScanMode() && !scan.prefersReducedMotion()) {
          <div class="view-toggle mono no-print decor-only" role="group" aria-label="Skills view">
            <button type="button" [class.on]="!force2d()" (click)="force2d.set(false)">3D</button>
            <button type="button" [class.on]="force2d()" (click)="force2d.set(true)">2D</button>
          </div>
        }
      </div>

      @if (show3d()) {
        <div appReveal>
          <app-skill-constellation />
        </div>
      } @else {
        <div class="grid">
          @for (group of cv.skills; track group.icon) {
            <article class="card glass glass-hover" appReveal>
              <h3 class="cat">{{ group.category | loc: lang() }}</h3>
              <ul class="items">
                @for (s of group.items; track s.name) {
                  <li class="item">
                    <div class="meta">
                      <span class="name">{{ s.name }}</span>
                      <span class="lvl mono">{{ s.level }}</span>
                    </div>
                    <div class="bar decor-only" aria-hidden="true">
                      <span [style.width.%]="s.level"></span>
                    </div>
                  </li>
                }
              </ul>
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .view-toggle {
        display: inline-flex;
        border: 1px solid var(--border-soft);
        border-radius: 999px;
        overflow: hidden;
      }
      .view-toggle button {
        background: transparent;
        border: none;
        color: var(--text-2);
        padding: 0.35rem 0.9rem;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .view-toggle button.on {
        background: rgba(6, 215, 240, 0.16);
        color: var(--neon-cyan);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.1rem;
      }
      .card {
        padding: 1.3rem;
      }
      .cat {
        font-size: 1.05rem;
        margin: 0 0 1rem;
        color: var(--neon-cyan);
      }
      .items {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
      }
      .meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
      }
      .name {
        color: var(--text-1);
      }
      .lvl {
        color: var(--text-2);
        font-size: 0.78rem;
      }
      .bar {
        height: 5px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.07);
        margin-top: 0.3rem;
        overflow: hidden;
      }
      .bar span {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
      }
    `,
  ],
})
export class SkillsComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly scan = inject(ScanModeService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
  readonly force2d = signal(false);
  /** False during SSR and until hydration completes — keeps server/client markup identical. */
  private readonly browserReady = signal(false);

  constructor() {
    afterNextRender(() => this.browserReady.set(true));
  }

  /** 3D only after hydration, in Explore mode, when motion is allowed and 2D isn't forced. */
  readonly show3d = computed(
    () =>
      this.browserReady() &&
      !this.scan.isScanMode() &&
      !this.scan.prefersReducedMotion() &&
      !this.force2d(),
  );
}
