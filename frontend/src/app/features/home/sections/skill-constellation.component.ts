import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { CvService } from '../../../core/services/cv.service';
import { LocaleService } from '../../../core/services/locale.service';

const CATEGORY_COLORS = [0x06d7f0, 0xff3df0, 0xa855f7, 0x39ff9e, 0xffb13d, 0x4f8cff];

interface NodeMeta {
  name: string;
  category: string;
}

/**
 * 3D "Skill Constellation": each category is a cluster of glowing skill nodes
 * orbiting a hub, connected by neon lines, slowly auto-rotating with mouse
 * parallax. Browser-only and lazy-loaded (Three.js never reaches the server
 * bundle). The 2D grid in SkillsComponent remains the fallback for Scan Mode,
 * reduced-motion and mobile.
 */
@Component({
  selector: 'app-skill-constellation',
  standalone: true,
  template: `
    <div #host class="stage" role="img" [attr.aria-label]="ariaLabel">
      <div #tip class="tip" [style.opacity]="tipText ? 1 : 0" [style.left.px]="tipX" [style.top.px]="tipY">
        {{ tipText }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .stage {
        position: relative;
        width: 100%;
        height: 460px;
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: grab;
      }
      .stage:active {
        cursor: grabbing;
      }
      .stage canvas {
        display: block;
      }
      .tip {
        position: absolute;
        transform: translate(-50%, -140%);
        pointer-events: none;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-0);
        background: rgba(7, 6, 15, 0.9);
        border: 1px solid var(--border-strong);
        padding: 0.3rem 0.6rem;
        border-radius: 8px;
        white-space: nowrap;
        transition: opacity 0.2s ease;
        z-index: 2;
      }
    `,
  ],
})
export class SkillConstellationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host') host!: ElementRef<HTMLDivElement>;
  private readonly cv = inject(CvService).getCv();
  private readonly locale = inject(LocaleService);
  private readonly zone = inject(NgZone);

  tipText = '';
  tipX = 0;
  tipY = 0;
  readonly ariaLabel = 'Interactive 3D skill constellation';

  private cleanup?: () => void;

  constructor() {
    // Defer all Three.js work to the browser, after the DOM exists.
    afterNextRender(() => this.init());
  }

  ngAfterViewInit(): void {
    // host is available; afterNextRender callback handles init timing.
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }

  private async init(): Promise<void> {
    const THREE = await import('three');
    const el = this.host.nativeElement;
    const width = el.clientWidth || 600;
    const height = el.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    el.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Starfield backdrop
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 60;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x6b6890, size: 0.08, transparent: true, opacity: 0.6 }),
    );
    scene.add(stars);

    const lang = this.locale.lang();
    const nodeMeshes: Array<{ mesh: THREE.Mesh; meta: NodeMeta }> = [];
    const groups = this.cv.skills;
    const clusterRadius = 9;

    groups.forEach((group, gi) => {
      const color = CATEGORY_COLORS[gi % CATEGORY_COLORS.length];
      // Distribute clusters on a sphere (Fibonacci)
      const phi = Math.acos(1 - (2 * (gi + 0.5)) / groups.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * gi;
      const hub = new THREE.Vector3(
        clusterRadius * Math.sin(phi) * Math.cos(theta),
        clusterRadius * Math.sin(phi) * Math.sin(theta),
        clusterRadius * Math.cos(phi),
      );

      // Hub label sprite
      const label = this.makeLabel(THREE, group.category[lang], color);
      label.position.copy(hub).multiplyScalar(1.18);
      root.add(label);

      group.items.forEach((item, ii) => {
        const a = (ii / group.items.length) * Math.PI * 2;
        const r = 2.4;
        const pos = hub
          .clone()
          .add(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 1.6));
        const size = 0.34;
        const mat = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 16), mat);
        mesh.position.copy(pos);
        root.add(mesh);
        nodeMeshes.push({ mesh, meta: { name: item.name, category: group.category[lang] } });

        // Glow halo
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(size * 1.9, 16, 16),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 }),
        );
        mesh.add(halo);

        // Line from hub to node
        const lineGeo = new THREE.BufferGeometry().setFromPoints([hub, pos]);
        const line = new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 }),
        );
        root.add(line);
      });
    });

    // Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-2, -2);
    let targetRotX = 0;
    let targetRotY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotY = pointer.x * 0.5;
      targetRotX = pointer.y * 0.3;
      this.tipX = e.clientX - rect.left;
      this.tipY = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.set(-2, -2);
      targetRotX = 0;
      targetRotY = 0;
      this.zone.run(() => (this.tipText = ''));
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    let hovered: THREE.Mesh | null = null;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      root.rotation.y += 0.0016;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.05;
      root.rotation.y += (targetRotY - (root.rotation.y % (Math.PI * 2))) * 0.0;
      stars.rotation.y -= 0.0004;

      // Hover detection
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh), false);
      const hit = hits[0]?.object as THREE.Mesh | undefined;
      if (hit !== hovered) {
        if (hovered) hovered.scale.setScalar(1);
        hovered = hit ?? null;
        if (hovered) {
          hovered.scale.setScalar(1.5);
          const meta = nodeMeshes.find((n) => n.mesh === hovered)?.meta;
          if (meta) this.zone.run(() => (this.tipText = meta.name));
        } else {
          this.zone.run(() => (this.tipText = ''));
        }
      }
      renderer.render(scene, camera);
    };
    // Run the rAF loop outside Angular to avoid change-detection churn.
    this.zone.runOutsideAngular(animate);

    this.cleanup = () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }

  private makeLabel(THREE: typeof import('three'), text: string, color: number): import('three').Sprite {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const fontSize = 44;
    ctx.font = `700 ${fontSize}px Rajdhani, sans-serif`;
    const w = ctx.measureText(text).width + 32;
    canvas.width = w;
    canvas.height = fontSize + 24;
    ctx.font = `700 ${fontSize}px Rajdhani, sans-serif`;
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 16, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set((w / canvas.height) * 1.6, 1.6, 1);
    return sprite;
  }
}
