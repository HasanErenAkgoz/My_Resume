import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CookieBannerComponent } from './layout/cookie-banner/cookie-banner.component';
import { BootSequenceComponent } from './layout/boot-sequence/boot-sequence.component';
import { CommandPaletteComponent } from './layout/command-palette/command-palette.component';
import { AiChatComponent } from './features/ai-chat/ai-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CookieBannerComponent,
    BootSequenceComponent,
    CommandPaletteComponent,
    AiChatComponent,
  ],
  template: `
    <app-header />
    <main id="main">
      <router-outlet />
    </main>
    <app-footer />
    <app-cookie-banner />
    <app-boot-sequence />
    <app-command-palette />
    <app-ai-chat />
  `,
})
export class AppComponent {}
