import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../core/services/locale.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { UiPipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink, UiPipe],
  template: `
    @if (analytics.consent() === null) {
      <div class="cookie-banner glass no-print" role="dialog" aria-live="polite">
        <p class="txt">
          {{ 'cookieText' | ui: lang() }}
          <a routerLink="/privacy">{{ 'privacyLink' | ui: lang() }}</a>
        </p>
        <div class="acts">
          <button type="button" class="btn btn-ghost sm" (click)="analytics.setConsent(false)">
            {{ 'cookieReject' | ui: lang() }}
          </button>
          <button type="button" class="btn btn-primary sm" (click)="analytics.setConsent(true)">
            {{ 'cookieAccept' | ui: lang() }}
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .cookie-banner {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        max-width: 560px;
        margin-inline: auto;
        z-index: 60;
        padding: 1rem 1.2rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.8rem 1rem;
      }
      .txt {
        margin: 0;
        flex: 1 1 240px;
        font-size: 0.85rem;
        color: var(--text-1);
      }
      .acts {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
      }
      .sm {
        padding: 0.45rem 0.9rem;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class CookieBannerComponent {
  readonly analytics = inject(AnalyticsService);
  private readonly locale = inject(LocaleService);
  readonly lang = this.locale.lang;
}
