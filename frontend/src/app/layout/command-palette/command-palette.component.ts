import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, computed, inject, signal } from '@angular/core';
import { LocaleService } from '../../core/services/locale.service';
import { ScanModeService } from '../../core/services/scan-mode.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { UiStateService } from '../../core/services/ui-state.service';

interface Command {
  id: string;
  label: { tr: string; en: string };
  hint?: string;
  run: () => void;
}

/**
 * Ctrl/Cmd+K command palette: quick navigation and actions (jump to sections,
 * toggle language / Scan Mode, download CV, open AI chat). Fully keyboard-driven.
 */
@Component({
  selector: 'app-command-palette',
  standalone: true,
  template: `
    @if (ui.paletteOpen()) {
      <div class="overlay no-print" (click)="close()">
        <div class="palette glass" (click)="$event.stopPropagation()" role="dialog" aria-label="Command palette">
          <input
            #box
            class="input mono"
            [placeholder]="lang() === 'tr' ? 'Komut ara...' : 'Search commands...'"
            [value]="query()"
            (input)="onInput($event)"
            (keydown)="onKey($event)"
            autofocus
          />
          <ul class="list">
            @for (c of filtered(); track c.id; let i = $index) {
              <li
                class="item"
                [class.active]="i === active()"
                (click)="exec(c)"
                (mouseenter)="active.set(i)"
              >
                <span class="lbl">{{ c.label[lang()] }}</span>
                @if (c.hint) {
                  <span class="hint mono">{{ c.hint }}</span>
                }
              </li>
            }
            @if (filtered().length === 0) {
              <li class="empty mono">{{ lang() === 'tr' ? 'sonuç yok' : 'no results' }}</li>
            }
          </ul>
          <div class="foot mono">↑↓ {{ lang() === 'tr' ? 'gez' : 'navigate' }} · ↵ {{ lang() === 'tr' ? 'seç' : 'select' }} · esc</div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        z-index: 150;
        background: rgba(5, 4, 16, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 14vh;
      }
      .palette {
        width: min(560px, 92vw);
        padding: 0.6rem;
        border-color: var(--border-strong);
        box-shadow: var(--glow-cyan);
      }
      .input {
        width: 100%;
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--border-soft);
        color: var(--text-0);
        font-size: 1rem;
        padding: 0.7rem 0.6rem;
        outline: none;
      }
      .list {
        max-height: 320px;
        overflow-y: auto;
        margin-top: 0.4rem;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.7rem;
        border-radius: 8px;
        cursor: pointer;
      }
      .item.active {
        background: rgba(6, 215, 240, 0.12);
      }
      .lbl {
        color: var(--text-0);
      }
      .hint {
        font-size: 0.72rem;
        color: var(--text-2);
      }
      .empty {
        padding: 0.8rem 0.7rem;
        color: var(--text-2);
      }
      .foot {
        font-size: 0.72rem;
        color: var(--text-2);
        padding: 0.5rem 0.7rem 0.2rem;
        border-top: 1px solid var(--border-soft);
        margin-top: 0.3rem;
      }
    `,
  ],
})
export class CommandPaletteComponent {
  readonly ui = inject(UiStateService);
  private readonly locale = inject(LocaleService);
  private readonly scan = inject(ScanModeService);
  private readonly analytics = inject(AnalyticsService);
  readonly lang = this.locale.lang;

  readonly query = signal('');
  readonly active = signal(0);

  private readonly commands: Command[] = [
    { id: 'cases', label: { tr: 'Vaka Çalışmaları', en: 'Case Studies' }, hint: '#cases', run: () => this.scrollTo('cases') },
    { id: 'experience', label: { tr: 'Deneyim', en: 'Experience' }, hint: '#experience', run: () => this.scrollTo('experience') },
    { id: 'skills', label: { tr: 'Yetkinlikler', en: 'Skills' }, hint: '#skills', run: () => this.scrollTo('skills') },
    { id: 'contact', label: { tr: 'İletişim', en: 'Contact' }, hint: '#contact', run: () => this.scrollTo('contact') },
    { id: 'chat', label: { tr: 'AI Asistan ile konuş', en: 'Talk to AI assistant' }, hint: 'AI', run: () => this.ui.openChat() },
    { id: 'cv', label: { tr: 'CV indir (PDF)', en: 'Download CV (PDF)' }, hint: 'PDF', run: () => this.download() },
    { id: 'lang', label: { tr: 'Dili değiştir (TR/EN)', en: 'Switch language (TR/EN)' }, run: () => this.locale.toggle() },
    { id: 'scan', label: { tr: 'Scan / Explore modu', en: 'Toggle Scan / Explore' }, run: () => this.scan.toggle() },
  ];

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.commands;
    return this.commands.filter((c) => `${c.label.tr} ${c.label.en} ${c.hint ?? ''}`.toLowerCase().includes(q));
  });

  constructor(@Inject(DOCUMENT) private readonly doc: Document) {}

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.ui.togglePalette();
      this.query.set('');
      this.active.set(0);
    } else if (e.key === 'Escape' && this.ui.paletteOpen()) {
      this.close();
    }
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.active.set(0);
  }

  onKey(e: KeyboardEvent): void {
    const items = this.filtered();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.active.update((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.active.update((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = items[this.active()];
      if (c) this.exec(c);
    }
  }

  exec(c: Command): void {
    c.run();
    this.close();
  }

  close(): void {
    this.ui.paletteOpen.set(false);
  }

  private scrollTo(id: string): void {
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  private download(): void {
    this.analytics.track('pdf_download');
    const a = this.doc.createElement('a');
    a.href = '/assets/cv/HasanErenAkgoz-CV.pdf';
    a.download = '';
    a.click();
  }
}
