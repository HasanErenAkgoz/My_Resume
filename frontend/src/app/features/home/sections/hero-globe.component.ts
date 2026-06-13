import { Component } from '@angular/core';

/** Wireframe globe visual for the hero — decorative only (hidden in Scan Mode). */
@Component({
  selector: 'app-hero-globe',
  standalone: true,
  template: `
    <div class="globe-wrap decor-only" aria-hidden="true">
      <div class="ring r1"></div>
      <div class="ring r2"></div>
      <div class="ring r3"></div>
      <svg class="globe" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="globeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#06d7f0" />
            <stop offset="1" stop-color="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="72" fill="none" stroke="url(#globeGrad)" stroke-width="1.2" opacity="0.9" />
        <ellipse cx="100" cy="100" rx="72" ry="28" fill="none" stroke="#06d7f0" stroke-width="0.8" opacity="0.55" />
        <ellipse cx="100" cy="100" rx="72" ry="48" fill="none" stroke="#06d7f0" stroke-width="0.7" opacity="0.4" />
        <ellipse cx="100" cy="72" rx="48" ry="72" fill="none" stroke="#a855f7" stroke-width="0.7" opacity="0.45" />
        <ellipse cx="100" cy="100" rx="28" ry="72" fill="none" stroke="#a855f7" stroke-width="0.7" opacity="0.35" />
        <ellipse cx="128" cy="100" rx="48" ry="72" fill="none" stroke="#06d7f0" stroke-width="0.6" opacity="0.3" />
        <path d="M28 100 H172" stroke="#06d7f0" stroke-width="0.6" opacity="0.35" />
        <path d="M36 72 Q100 92 164 72" fill="none" stroke="#ff3df0" stroke-width="0.6" opacity="0.4" />
        <path d="M36 128 Q100 108 164 128" fill="none" stroke="#ff3df0" stroke-width="0.6" opacity="0.4" />
        <circle cx="100" cy="100" r="4" fill="#06d7f0" />
        <circle cx="138" cy="78" r="3" fill="#a855f7" />
        <circle cx="62" cy="118" r="2.5" fill="#06d7f0" />
        <circle cx="120" cy="132" r="2" fill="#39ff9e" />
      </svg>
      <span class="node n1"></span>
      <span class="node n2"></span>
      <span class="node n3"></span>
    </div>
  `,
  styles: [
    `
      .globe-wrap {
        position: relative;
        width: min(380px, 100%);
        aspect-ratio: 1;
        margin-inline: auto;
      }
      .globe {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 24px rgba(6, 215, 240, 0.35));
        animation: globeSpin 24s linear infinite;
      }
      .ring {
        position: absolute;
        inset: 8%;
        border-radius: 50%;
        border: 1px solid rgba(6, 215, 240, 0.25);
        pointer-events: none;
      }
      .ring.r1 {
        inset: 0;
        animation: ringPulse 4s ease-in-out infinite;
      }
      .ring.r2 {
        inset: -6%;
        border-color: rgba(168, 85, 247, 0.2);
        animation: ringPulse 5s ease-in-out infinite reverse;
      }
      .ring.r3 {
        inset: 12%;
        border-style: dashed;
        border-color: rgba(255, 61, 240, 0.18);
        animation: ringSpin 18s linear infinite;
      }
      .node {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--neon-cyan);
        box-shadow: 0 0 12px var(--neon-cyan);
      }
      .node.n1 {
        top: 18%;
        right: 12%;
        animation: nodeFloat 3s ease-in-out infinite;
      }
      .node.n2 {
        bottom: 22%;
        left: 8%;
        background: var(--neon-purple);
        box-shadow: 0 0 12px var(--neon-purple);
        animation: nodeFloat 4s ease-in-out infinite reverse;
      }
      .node.n3 {
        top: 42%;
        left: 2%;
        width: 6px;
        height: 6px;
        animation: nodeFloat 3.5s ease-in-out infinite;
      }
      @keyframes globeSpin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes ringSpin {
        to {
          transform: rotate(-360deg);
        }
      }
      @keyframes ringPulse {
        50% {
          opacity: 0.45;
          transform: scale(1.03);
        }
      }
      @keyframes nodeFloat {
        50% {
          transform: translateY(-8px);
        }
      }
    `,
  ],
})
export class HeroGlobeComponent {}
