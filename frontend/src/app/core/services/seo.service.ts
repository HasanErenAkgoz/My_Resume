import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CvData } from '../models/cv.model';

const SITE_URL = 'https://hasaneren.dev';
const JSON_LD_ID = 'cv-jsonld';

/**
 * Centralizes document <title>, meta description, Open Graph / Twitter cards and
 * the Schema.org JSON-LD Person block. Runs during SSR so crawlers and the
 * LinkedIn/Facebook scrapers see fully-rendered tags without executing JS.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {}

  apply(cv: CvData, lang: 'tr' | 'en'): void {
    const name = cv.profile.name;
    const role = cv.profile.title[lang];
    const pageTitle = `${name} — ${role}`;
    const description =
      lang === 'tr'
        ? `${cv.hrSignals.yearsOfExperience} yıl deneyimli Full Stack Geliştirici · Feedback4e · .NET · Angular · OpenAI`
        : `${cv.hrSignals.yearsOfExperience} years Full Stack Developer · Feedback4e · .NET · Angular · OpenAI`;
    const image = `${SITE_URL}/assets/images/og-banner.svg`;

    this.title.setTitle(pageTitle);
    this.upsertName('description', description);

    this.upsertProperty('og:type', 'website');
    this.upsertProperty('og:title', pageTitle);
    this.upsertProperty('og:description', description);
    this.upsertProperty('og:image', image);
    this.upsertProperty('og:url', SITE_URL);
    this.upsertProperty('og:locale', lang === 'tr' ? 'tr_TR' : 'en_US');

    this.upsertName('twitter:card', 'summary_large_image');
    this.upsertName('twitter:title', pageTitle);
    this.upsertName('twitter:description', description);
    this.upsertName('twitter:image', image);

    this.setJsonLd(cv, role);
  }

  private setJsonLd(cv: CvData, jobTitle: string): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: cv.profile.name,
      jobTitle,
      email: `mailto:${cv.profile.contact.email}`,
      url: SITE_URL,
      image: `${SITE_URL}${cv.profile.photo}`,
      sameAs: [cv.profile.contact.linkedin, cv.profile.contact.github],
      knowsAbout: ['.NET', 'Angular', 'OpenAI', 'TypeScript', 'C#', 'Clean Architecture'],
    };

    let script = this.doc.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }

  private upsertName(name: string, content: string): void {
    if (this.meta.getTag(`name="${name}"`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private upsertProperty(property: string, content: string): void {
    if (this.meta.getTag(`property="${property}"`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }
}
