import { Component, OnInit, effect, inject } from '@angular/core';
import { CvService } from '../../core/services/cv.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { HeroComponent } from './sections/hero.component';
import { CaseStudiesComponent } from './sections/case-studies.component';
import { MissionLogsComponent } from './sections/mission-logs.component';
import { SkillsComponent } from './sections/skills.component';
import { GithubComponent } from './sections/github.component';
import { EducationComponent } from './sections/education.component';
import { ContactComponent } from './sections/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CaseStudiesComponent,
    MissionLogsComponent,
    SkillsComponent,
    GithubComponent,
    EducationComponent,
    ContactComponent,
  ],
  template: `
    <section id="summary" class="sec-hero"><app-hero /></section>
    <section id="cases"><app-case-studies /></section>
    <section id="experience"><app-mission-logs /></section>
    <section id="skills"><app-skills /></section>
    <section id="github"><app-github /></section>
    <section id="education"><app-education /></section>
    <section id="contact"><app-contact /></section>
  `,
  styles: [
    `
      .sec-hero {
        padding-top: 0;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly cvService = inject(CvService);
  private readonly locale = inject(LocaleService);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(AnalyticsService);

  constructor() {
    // Re-apply SEO tags whenever the language changes.
    effect(() => {
      this.seo.apply(this.cvService.getCv(), this.locale.lang());
    });
  }

  ngOnInit(): void {
    this.analytics.track('page_view');
  }
}
