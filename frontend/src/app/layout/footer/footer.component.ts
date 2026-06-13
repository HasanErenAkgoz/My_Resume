import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CvService } from '../../core/services/cv.service';
import { LocaleService } from '../../core/services/locale.service';
import { UiPipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, UiPipe],
  template: `
    <footer class="ftr no-print">
      <div class="container ftr-inner">
        <p class="mono note">
          © {{ year }} {{ cv.profile.name }} ·
          <span>{{ 'footerNote' | ui: lang() }}</span>
        </p>
        <nav class="links">
          <a [href]="cv.profile.contact.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          <a [href]="cv.profile.contact.github" target="_blank" rel="noopener">GitHub</a>
          <a routerLink="/privacy">{{ 'privacyLink' | ui: lang() }}</a>
        </nav>
      </div>
    </footer>
  `,
  styles: [
    `
      .ftr {
        border-top: 1px solid var(--border-soft);
        padding-block: 1.6rem;
        margin-top: 2rem;
      }
      .ftr-inner {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem 1.5rem;
        align-items: center;
        justify-content: space-between;
      }
      .note {
        color: var(--text-2);
        font-size: 0.85rem;
        margin: 0;
      }
      .links {
        display: flex;
        gap: 1.2rem;
        font-size: 0.9rem;
      }
      .links a {
        color: var(--text-1);
      }
    `,
  ],
})
export class FooterComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
  readonly year = new Date().getFullYear();
}
