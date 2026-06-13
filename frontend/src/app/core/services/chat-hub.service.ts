import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IStreamResult,
  LogLevel,
} from '@microsoft/signalr';

export interface ChatStreamRequest {
  lang: 'tr' | 'en';
  messages: { role: 'user' | 'assistant'; content: string }[];
}

/**
 * Manages the SignalR connection to the .NET 8 ChatHub and exposes the
 * server-to-client token stream. The connection is created lazily on first use
 * (browser only) so SSR is never affected.
 */
@Injectable({ providedIn: 'root' })
export class ChatHubService {
  private connection?: HubConnection;

  private resolveHubUrl(): string {
    const override = (globalThis as { __CHAT_HUB_URL__?: string }).__CHAT_HUB_URL__;
    if (override) return override;

    const { protocol, hostname, port, origin } = window.location;
    // Local Angular dev/SSR (ng serve 4200, SSR 4000) → talk to the .NET API on 5080.
    if (hostname === 'localhost' && (port === '4200' || port === '4000')) {
      return `${protocol}//${hostname}:5080/hubs/chat`;
    }
    // Production: same origin, reverse-proxied to the API.
    return `${origin}/hubs/chat`;
  }

  private async ensureConnected(): Promise<HubConnection> {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      return this.connection;
    }

    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl(this.resolveHubUrl())
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();
    }

    if (this.connection.state === HubConnectionState.Disconnected) {
      await this.connection.start();
    }
    return this.connection;
  }

  async stream(request: ChatStreamRequest): Promise<IStreamResult<string>> {
    const conn = await this.ensureConnected();
    return conn.stream<string>('StreamChat', request);
  }
}
