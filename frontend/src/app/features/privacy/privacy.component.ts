import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CvService } from '../../core/services/cv.service';
import { LocaleService } from '../../core/services/locale.service';
import { UiPipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, UiPipe],
  template: `
    <div class="container narrow">
      <a routerLink="/" class="back mono">← {{ 'backHome' | ui: lang() }}</a>

      @if (lang() === 'tr') {
        <h1>Gizlilik Politikası</h1>
        <p class="upd mono">Son güncelleme: {{ updated }}</p>

        <h2>Veri Sorumlusu</h2>
        <p>
          Bu web sitesi {{ cv.profile.name }} tarafından kişisel tanıtım ve CV amacıyla
          işletilmektedir. İletişim:
          <a [href]="'mailto:' + cv.profile.contact.email">{{ cv.profile.contact.email }}</a>.
        </p>

        <h2>Toplanan Veriler</h2>
        <p>
          Site, yalnızca açık onayınız ile anonim ziyaret istatistikleri (görüntülenen bölümler,
          dil/mod tercihi, CV indirme sayısı) toplar. Onay vermediğiniz sürece hiçbir analitik veri
          toplanmaz. İsim, e-posta veya kişisel veri formla toplanmaz.
        </p>

        <h2>Çerezler</h2>
        <p>
          Dil ve görünüm tercihiniz tarayıcınızda <code>localStorage</code> içinde saklanır.
          Analitik çerezleri yalnızca onay verdiğinizde etkinleşir ve istediğiniz zaman reddedebilirsiniz.
        </p>

        <h2>Haklarınız (KVKK)</h2>
        <p>
          6698 sayılı KVKK kapsamında verilerinize erişme, düzeltme ve silinmesini talep etme
          haklarına sahipsiniz. Talepleriniz için yukarıdaki e-posta adresinden iletişime geçebilirsiniz.
        </p>
      } @else {
        <h1>Privacy Policy</h1>
        <p class="upd mono">Last updated: {{ updated }}</p>

        <h2>Data Controller</h2>
        <p>
          This website is operated by {{ cv.profile.name }} for personal portfolio and CV purposes.
          Contact:
          <a [href]="'mailto:' + cv.profile.contact.email">{{ cv.profile.contact.email }}</a>.
        </p>

        <h2>Data We Collect</h2>
        <p>
          With your explicit consent only, the site collects anonymous visit statistics (sections
          viewed, language/mode preference, CV downloads). No analytics data is collected until you
          consent. No names, emails or personal data are collected via forms.
        </p>

        <h2>Cookies</h2>
        <p>
          Your language and display preferences are stored in your browser's <code>localStorage</code>.
          Analytics cookies are enabled only after you accept and can be rejected at any time.
        </p>

        <h2>Your Rights (GDPR / KVKK)</h2>
        <p>
          You have the right to access, rectify and request deletion of your data. For any request,
          contact the email address above.
        </p>
      }
    </div>
  `,
  styles: [
    `
      .narrow {
        max-width: 760px;
        padding-block: 3rem;
      }
      .back {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: var(--neon-cyan);
      }
      h1 {
        font-size: clamp(2rem, 5vw, 2.8rem);
      }
      h2 {
        margin-top: 2rem;
        font-size: 1.3rem;
        color: var(--neon-cyan);
      }
      .upd {
        color: var(--text-2);
        font-size: 0.85rem;
      }
      code {
        font-family: var(--font-mono);
        background: rgba(255, 255, 255, 0.06);
        padding: 0.1em 0.4em;
        border-radius: 4px;
      }
    `,
  ],
})
export class PrivacyComponent {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  readonly cv = this.cvService.getCv();
  readonly lang = this.locale.lang;
  readonly updated = '2026-06';
}
