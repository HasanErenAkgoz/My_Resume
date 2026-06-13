import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { LocaleService } from '../../core/services/locale.service';
import { ScanModeService } from '../../core/services/scan-mode.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { ChatHubService } from '../../core/services/chat-hub.service';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS: Record<'tr' | 'en', string[]> = {
  tr: [
    'Bu adayı 30 saniyede özetle',
    'En güçlü teknik becerileri neler?',
    'OpenAI ile hangi projeleri yaptı?',
    'Hangi teknolojilerde deneyimli?',
  ],
  en: [
    'Summarize this candidate in 30 seconds',
    'What are the strongest technical skills?',
    'Which projects used OpenAI?',
    'Which technologies is he experienced in?',
  ],
};

/**
 * AI assistant terminal. Streams answers from the .NET 8 SignalR ChatHub
 * (CV-only context) token-by-token. Recruiter-focused suggestion chips, a KVKK
 * notice and a graceful demo reply when no API key is configured server-side.
 */
@Component({
  selector: 'app-ai-chat',
  standalone: true,
  template: `
    <button
      type="button"
      class="launcher mono decor-only no-print"
      [class.hidden]="ui.chatOpen()"
      (click)="open()"
      aria-label="AI assistant"
    >
      <span class="pulse"></span> AI
    </button>

    @if (ui.chatOpen()) {
      <div class="panel glass no-print" role="dialog" aria-label="AI assistant">
        <header class="bar mono">
          <span class="t"><span class="dot"></span> ai_assistant.sh</span>
          <button type="button" class="x" (click)="ui.chatOpen.set(false)" aria-label="Close">✕</button>
        </header>

        <div class="log" #log>
          @if (messages().length === 0) {
            <p class="intro">{{ intro }}</p>
            <div class="chips">
              @for (s of suggestions; track s) {
                <button type="button" class="chip" (click)="ask(s)">{{ s }}</button>
              }
            </div>
          }
          @for (m of messages(); track $index) {
            <div class="msg" [class.user]="m.role === 'user'">
              <span class="who mono">{{ m.role === 'user' ? '>' : 'ai' }}</span>
              <p>
                {{ m.content }}@if (m.role === 'assistant' && streaming() && $index === messages().length - 1) {<span class="caret">▌</span>}
              </p>
            </div>
          }
        </div>

        <form class="composer" (submit)="submit($event)">
          <input
            class="field mono"
            [value]="draft"
            (input)="draft = $any($event.target).value"
            [placeholder]="lang() === 'tr' ? 'Soru yaz...' : 'Ask a question...'"
            [disabled]="streaming()"
          />
          <button type="submit" class="send" [disabled]="streaming()" aria-label="Send">↵</button>
        </form>
        <p class="kvkk mono">{{ kvkk }}</p>
      </div>
    }
  `,
  styles: [
    `
      .launcher {
        position: fixed;
        right: 1.2rem;
        bottom: 1.2rem;
        z-index: 90;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.7rem 1.1rem;
        border-radius: 999px;
        border: 1px solid var(--border-strong);
        background: linear-gradient(120deg, rgba(6, 215, 240, 0.18), rgba(168, 85, 247, 0.18));
        color: var(--text-0);
        cursor: pointer;
        box-shadow: var(--glow-cyan);
        backdrop-filter: blur(10px);
      }
      .launcher.hidden {
        display: none;
      }
      .pulse {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--neon-green);
        box-shadow: 0 0 10px var(--neon-green);
        animation: pulse 1.6s infinite;
      }
      @keyframes pulse {
        50% {
          opacity: 0.4;
        }
      }
      .panel {
        position: fixed;
        right: 1.2rem;
        bottom: 1.2rem;
        z-index: 95;
        width: min(400px, 92vw);
        height: min(560px, 78vh);
        display: flex;
        flex-direction: column;
        border-color: var(--border-strong);
        box-shadow: var(--glow-cyan);
        overflow: hidden;
      }
      .bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.7rem 0.9rem;
        border-bottom: 1px solid var(--border-soft);
        background: rgba(255, 255, 255, 0.03);
      }
      .t {
        color: var(--text-1);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.45rem;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--neon-green);
        box-shadow: 0 0 8px var(--neon-green);
      }
      .x {
        background: none;
        border: none;
        color: var(--text-2);
        cursor: pointer;
        font-size: 0.9rem;
      }
      .log {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }
      .intro {
        color: var(--text-2);
        font-size: 0.88rem;
        margin: 0;
      }
      .chips {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .chips .chip {
        text-align: left;
        cursor: pointer;
        background: rgba(6, 215, 240, 0.08);
        border: 1px solid var(--border-soft);
        color: var(--text-1);
        padding: 0.5rem 0.7rem;
        border-radius: 8px;
        font-size: 0.84rem;
        font-family: inherit;
      }
      .chips .chip:hover {
        border-color: var(--border-strong);
        color: var(--neon-cyan);
      }
      .msg {
        display: flex;
        gap: 0.55rem;
        font-size: 0.9rem;
      }
      .msg .who {
        flex: 0 0 auto;
        color: var(--neon-cyan);
        font-size: 0.78rem;
        padding-top: 0.15rem;
      }
      .msg.user .who {
        color: var(--neon-green);
      }
      .msg p {
        margin: 0;
        color: var(--text-1);
      }
      .msg.user p {
        color: var(--text-0);
      }
      .caret {
        color: var(--neon-cyan);
      }
      .composer {
        display: flex;
        gap: 0.4rem;
        padding: 0.7rem;
        border-top: 1px solid var(--border-soft);
      }
      .field {
        flex: 1;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-soft);
        border-radius: 8px;
        color: var(--text-0);
        padding: 0.55rem 0.7rem;
        outline: none;
      }
      .send {
        background: linear-gradient(120deg, var(--neon-cyan), var(--neon-purple));
        border: none;
        color: var(--text-on-accent);
        border-radius: 8px;
        padding: 0 0.9rem;
        cursor: pointer;
        font-size: 1rem;
      }
      .send:disabled {
        opacity: 0.5;
        cursor: default;
      }
      .kvkk {
        margin: 0;
        padding: 0 0.7rem 0.6rem;
        font-size: 0.68rem;
        color: var(--text-2);
      }
    `,
  ],
})
export class AiChatComponent {
  @ViewChild('log') logEl?: ElementRef<HTMLDivElement>;
  readonly ui = inject(UiStateService);
  private readonly locale = inject(LocaleService);
  private readonly scan = inject(ScanModeService);
  private readonly analytics = inject(AnalyticsService);
  private readonly chatHub = inject(ChatHubService);
  readonly lang = this.locale.lang;

  readonly messages = signal<ChatMsg[]>([]);
  readonly streaming = signal(false);
  draft = '';

  get suggestions(): string[] {
    return SUGGESTIONS[this.lang()];
  }
  get intro(): string {
    return this.lang() === 'tr'
      ? "Merhaba! Hasan'ın CV'si hakkında soru sorabilirsiniz. Yanıtlar yalnızca CV verisinden üretilir."
      : "Hi! Ask anything about Hasan's CV. Answers are generated strictly from the CV data.";
  }
  get kvkk(): string {
    return this.lang() === 'tr'
      ? 'KVKK: Sohbet içeriği kalıcı olarak saklanmaz; yalnızca yanıt üretmek için işlenir.'
      : 'Privacy: Chat content is not stored permanently; processed only to generate a reply.';
  }

  open(): void {
    this.ui.openChat();
    this.analytics.track('ai_chat_open');
  }

  ask(text: string): void {
    this.draft = text;
    this.send();
  }

  submit(e: Event): void {
    e.preventDefault();
    this.send();
  }

  private async send(): Promise<void> {
    const text = this.draft.trim();
    if (!text || this.streaming()) return;
    this.draft = '';
    this.messages.update((m) => [...m, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
    this.streaming.set(true);
    this.scrollDown();

    const history = this.messages()
      .filter((m) => m.content)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const stream = await this.chatHub.stream({ lang: this.lang(), messages: history });
      await new Promise<void>((resolve) => {
        stream.subscribe({
          next: (token) => this.appendToLast(token),
          error: () => {
            this.appendToLast(this.lang() === 'tr' ? 'Bağlantı hatası.' : 'Connection error.');
            resolve();
          },
          complete: () => resolve(),
        });
      });
    } catch {
      this.appendToLast(this.lang() === 'tr' ? 'Asistan şu an kullanılamıyor.' : 'Assistant is currently unavailable.');
    } finally {
      this.streaming.set(false);
      this.scrollDown();
    }
  }

  private appendToLast(chunk: string): void {
    this.messages.update((m) => {
      const copy = [...m];
      const last = copy[copy.length - 1];
      if (last && last.role === 'assistant') copy[copy.length - 1] = { ...last, content: last.content + chunk };
      return copy;
    });
    this.scrollDown();
  }

  private scrollDown(): void {
    queueMicrotask(() => {
      const el = this.logEl?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
