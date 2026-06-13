import { Injectable, signal } from '@angular/core';

/** Cross-component UI state for overlays (command palette, AI chat). */
@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly paletteOpen = signal(false);
  readonly chatOpen = signal(false);

  openChat(): void {
    this.chatOpen.set(true);
  }
  toggleChat(): void {
    this.chatOpen.update((v) => !v);
  }
  togglePalette(): void {
    this.paletteOpen.update((v) => !v);
  }
}
