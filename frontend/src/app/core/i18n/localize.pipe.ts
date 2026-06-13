import { Pipe, PipeTransform } from '@angular/core';
import { Lang, Localized, LocalizedNullable } from '../models/cv.model';
import { UI, UiKey } from './ui-strings';

/** Resolves a bilingual content value. Pure + reactive: pass `lang()` as arg. */
@Pipe({ name: 'loc', standalone: true })
export class LocalizePipe implements PipeTransform {
  transform(value: Localized | LocalizedNullable | undefined | null, lang: Lang): string {
    if (!value) return '';
    return value[lang] ?? '';
  }
}

/** Resolves a UI chrome label by key. */
@Pipe({ name: 'ui', standalone: true })
export class UiPipe implements PipeTransform {
  transform(key: UiKey, lang: Lang): string {
    return UI[key][lang];
  }
}
