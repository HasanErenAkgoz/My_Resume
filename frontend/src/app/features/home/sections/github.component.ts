import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';
import { UiPipe } from '../../../core/i18n/localize.pipe';
import { RevealDirective } from '../../../shared/reveal.directive';

interface GhUser {
  public_repos: number;
  followers: number;
  html_url: string;
}

/**
 * Lightweight GitHub activity card. Uses the public GitHub API directly from the
 * browser (no token, generous unauth rate limit for a personal site) and a
 * static contribution-chart image. Fails gracefully: if the API is unreachable
 * the card simply shows the profile link.
 */
@Component({
  selector: 'app-github',
  standalone: true,
  imports: [UiPipe, RevealDirective],
  template: `
    <div class="container">
      <h2 class="section-title">{{ 'sectionGithub' | ui: lang() }}</h2>
      <p class="section-sub">git log --oneline</p>

      <article class="card glass glass-hover" appReveal>
        <div class="stats">
          @if (user(); as u) {
            <div class="stat">
              <span class="v">{{ u.public_repos }}</span>
              <span class="l mono">{{ 'reposPublic' | ui: lang() }}</span>
            </div>
            <div class="stat">
              <span class="v">{{ u.followers }}</span>
              <span class="l mono">{{ 'followers' | ui: lang() }}</span>
            </div>
          }
          <a class="btn btn-ghost" [href]="profileUrl" target="_blank" rel="noopener">
            &#64;{{ username }} ↗
          </a>
        </div>

        <img
          class="contrib decor-only"
          [src]="chartUrl"
          alt="GitHub contribution chart"
          loading="lazy"
          (error)="chartOk.set(false)"
          [style.display]="chartOk() ? 'block' : 'none'"
        />
      </article>
    </div>
  `,
  styles: [
    `
      .card {
        padding: 1.4rem;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }
      .stats {
        display: flex;
        align-items: center;
        gap: 2rem;
        flex-wrap: wrap;
      }
      .stat {
        display: flex;
        flex-direction: column;
      }
      .v {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.8rem;
        color: var(--text-0);
      }
      .l {
        font-size: 0.72rem;
        color: var(--text-2);
        text-transform: uppercase;
      }
      .stats .btn {
        margin-left: auto;
      }
      .contrib {
        width: 100%;
        border-radius: var(--radius-sm);
        opacity: 0.9;
      }
    `,
  ],
})
export class GithubComponent implements OnInit {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly lang = this.locale.lang;

  readonly username = 'HasanErenAkgoz';
  readonly profileUrl = this.cvService.getCv().profile.contact.github;
  readonly chartUrl = `https://ghchart.rshah.org/06d7f0/${this.username}`;
  readonly user = signal<GhUser | null>(null);
  readonly chartOk = signal(true);

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    fetch(`https://api.github.com/users/${this.username}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: GhUser | null) => {
        if (data) this.user.set(data);
      })
      .catch(() => void 0);
  }
}
