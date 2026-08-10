import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { NavTarget } from './siteConfig';

gsap.registerPlugin(ScrollTrigger);

export type GotoFn = (t: NavTarget) => void;

// Master timeline is 100 arbitrary units long, scrubbed across .story.
const T = {
  openEnd: 8,
  prStart: 12,
  prLen: 7,
  prEnd: 40,
  stStart: 45,
  stLen: 5,
  stEnd: 65,
  evStart: 70,
  evLen: 6,
  evEnd: 94,
  end: 100,
};

const GOTO_TIMES: Record<Exclude<NavTarget, 'verdict'>, number> = {
  opening: 0,
  practices: T.prStart + 3,
  strategy: T.stStart + 3,
  evidence: T.evStart + 3,
};

export function initStory(root: HTMLElement, onReady: (g: GotoFn) => void): () => void {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 861px)',
        mobile: '(max-width: 860px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (c) => {
        const { mobile, reduce } = c.conditions as { mobile: boolean; reduce: boolean };

        // --- Reduced motion: fully static, stacked layout, no timelines. ---
        if (reduce) {
          root.classList.add('is-static');
          const gotoStatic: GotoFn = (t) => {
            const sel = t === 'verdict' ? '.verdict' : `[data-scene="${t}"]`;
            document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          };
          onReady(gotoStatic);
          return () => root.classList.remove('is-static');
        }

        const iw = () => window.innerWidth;
        const ih = () => window.innerHeight;
        const q = gsap.utils.selector(root);

        // Anchor parking spot for the case file during scenes 02–04.
        const AX = () => (mobile ? -iw() * 0.26 : -iw() * 0.32);
        const AY = () => (mobile ? -ih() * 0.31 : ih() * 0.25);
        const AS = mobile ? 0.4 : 0.52;

        // Practice doc focal / stack spots (docs sit at left:50% top:50%).
        const FX = () => (mobile ? 0 : iw() * 0.14);
        const FY = () => (mobile ? ih() * 0.05 : 0);
        const SX = () => (mobile ? 0 : iw() * 0.27);
        const SY = () => (mobile ? -ih() * 0.02 : ih() * 0.06);

        // Evidence mini-slot offsets relative to the focal point (desktop).
        const SLOT_X = [-0.16, 0.04, 0.24]; // vw deltas from focal (left:34%)
        const slotX = (slot: number) => () => (mobile ? 0 : iw() * SLOT_X[slot]);
        const slotY = (_slot: number) => () => (mobile ? ih() * 0.3 : ih() * 0.32);
        const MINI_SCALE = mobile ? 0.55 : 0.34;
        const MINI_OPACITY = mobile ? 0 : 0.55;

        const counts = q('.ev-count');
        const statTargets = counts.map((el) => Number(el.getAttribute('data-value') ?? el.textContent ?? 0));
        const statShown = statTargets.map(() => -1);

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            // Runs on every render tick, including scrub catch-up.
            root.style.setProperty('--sp', tl.progress().toFixed(4));
            const t = tl.time();
            const activeIdx = (start: number, len: number) =>
              t < start ? -1 : Math.min(3, Math.floor((t - start) / len));
            const pi = activeIdx(T.prStart, T.prLen);
            q('.pr-index li').forEach((li, i) => li.classList.toggle('active', i === pi));
            const si = activeIdx(T.stStart, T.stLen);
            q('.st-node').forEach((n, i) => n.classList.toggle('active', i === si));
            // Evidence counters — deterministic function of timeline time.
            for (let i = 1; i < 4; i++) {
              const s = T.evStart + i * T.evLen;
              let val = statTargets[i];
              if (t > s && t < s + 4) {
                const p = (t - s) / 4;
                val = Math.round(statTargets[i] * (1 - (1 - p) * (1 - p)));
              }
              if (val !== statShown[i]) {
                counts[i].textContent = String(val);
                statShown[i] = val;
              }
            }
          },
        });

        // ---------- initial states (applied immediately) ----------
        gsap.set('.casefile', { xPercent: -50, yPercent: -50, x: mobile ? 0 : iw() * 0.17, y: mobile ? ih() * 0.2 : 0, scale: 1 });
        gsap.set('.pr-doc', { xPercent: -50, yPercent: -50, x: AX(), y: AY(), scale: AS * 0.9, opacity: 0, rotate: 4 });
        gsap.set('.st-node', { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.6 });
        gsap.set('.ev-item[data-i="0"]', { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, opacity: 1 });
        [1, 2, 3].forEach((i) => {
          gsap.set(`.ev-item[data-i="${i}"]`, {
            xPercent: -50,
            yPercent: -50,
            x: slotX(i - 1)(),
            y: slotY(i - 1)(),
            scale: MINI_SCALE,
            opacity: MINI_OPACITY,
          });
        });

        // ---------- SCENE 01 → cover opens ----------
        tl.fromTo('.cf-cover', { xPercent: 0, yPercent: 0, rotate: 0 }, { xPercent: -16, yPercent: 16, rotate: -7, duration: T.openEnd }, 0);
        const copyYP = mobile ? 0 : -50;
        tl.fromTo('.op-copy', { y: 0, yPercent: copyYP, opacity: 1 }, { y: -70, yPercent: copyYP, opacity: 0, duration: 6, ease: 'power1.in' }, 0);

        // ---------- case file parks at the anchor, practice index in ----------
        tl.to('.casefile', { x: AX, y: AY, scale: AS, opacity: mobile ? 0.35 : 1, duration: 4 }, T.openEnd);
        const indexYP = mobile ? 0 : -50;
        tl.fromTo('.pr-index', { opacity: 0, y: 30, yPercent: indexYP }, { opacity: 1, y: 0, yPercent: indexYP, duration: 2.5 }, T.openEnd + 1.5);

        // ---------- SCENE 02 — practice files cycle ----------
        const docs = q('.pr-doc');
        docs.forEach((_, i) => {
          const s = T.prStart + i * T.prLen;
          tl.fromTo(
            `.pr-doc[data-i="${i}"]`,
            { xPercent: -50, yPercent: -50, x: AX, y: AY, scale: AS * 0.9, opacity: 0, rotate: 5 },
            { x: FX, y: FY, scale: 1, opacity: 1, rotate: 0, duration: 3.2, ease: 'power3.out' },
            s,
          );
          tl.set(`.pr-doc[data-i="${i}"]`, { zIndex: 10 + i }, s);
          if (i > 0) {
            tl.to(`.pr-doc[data-i="${i - 1}"]`, { x: SX, y: SY, scale: mobile ? 0.88 : 0.9, opacity: mobile ? 0.22 : 0.45, rotate: 2.5, duration: 2.6 }, s);
          }
        });

        // ---------- SCENE 03 — docs converge into the strategy map ----------
        tl.to('.pr-doc', { x: 0, y: 0, scale: 0.3, opacity: 0, duration: 3.4, stagger: 0.25 }, T.prEnd);
        tl.to('.pr-index', { opacity: 0, y: -24, duration: 2 }, T.prEnd);
        tl.to('.casefile', { opacity: mobile ? 0 : 0.45, scale: AS * 0.85, duration: 3 }, T.prEnd);
        tl.fromTo('.st-info', { opacity: 0 }, { opacity: 1, duration: 1.5 }, T.prEnd + 0.5);
        tl.to('.st-map', { opacity: 1, duration: 1.5 }, T.prEnd + 0.5);
        tl.fromTo(
          '.st-spine',
          mobile ? { scaleY: 0 } : { scaleX: 0 },
          { ...(mobile ? { scaleY: 1 } : { scaleX: 1 }), duration: 3.6, ease: 'power2.inOut' },
          T.prEnd + 1,
        );
        tl.fromTo('.st-node', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2, stagger: 0.5 }, T.prEnd + 2);
        tl.fromTo('.sti[data-i="0"]', { opacity: 0, y: 24, yPercent: -50 }, { opacity: 1, y: 0, yPercent: -50, duration: 2 }, T.prEnd + 3);

        // Strategy steps progress.
        for (let i = 0; i < 4; i++) {
          const s = T.stStart + i * T.stLen;
          if (i > 0) {
            tl.to(`.sti[data-i="${i - 1}"]`, { opacity: 0, y: -18, duration: 1.6 }, s);
            tl.fromTo(`.sti[data-i="${i}"]`, { opacity: 0, y: 24, yPercent: -50 }, { opacity: 1, y: 0, yPercent: -50, duration: 2 }, s + 0.4);
          }
          if (i < 3) {
            tl.fromTo(
              `.st-seg[data-i="${i}"]`,
              mobile ? { scaleY: 0 } : { scaleX: 0 },
              { ...(mobile ? { scaleY: 1 } : { scaleX: 1 }), duration: 3, ease: 'power2.inOut' },
              s + 2,
            );
          }
        }

        // ---------- SCENE 04 — map dissolves, evidence assembles ----------
        tl.to(['.st-map', '.st-info'], { opacity: 0, y: -30, duration: 3 }, T.stEnd);
        tl.to('.casefile', { y: () => ih() * 0.34, opacity: mobile ? 0 : 0.3, duration: 3 }, T.stEnd);
        tl.fromTo('.ev-cap', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 2.5 }, T.stEnd + 1);
        tl.to('.ev-items', { opacity: 1, duration: 2 }, T.stEnd + 1.5);
        tl.fromTo('.ev-photos', { opacity: 0 }, { opacity: 1, duration: 2.5 }, T.stEnd + 2);
        tl.fromTo('.ph-a', { y: 60 }, { y: -40, duration: 24, ease: 'none' }, T.evStart);
        tl.fromTo('.ph-b', { y: 80 }, { y: -60, duration: 24, ease: 'none' }, T.evStart);

        for (let i = 0; i < 4; i++) {
          const s = T.evStart + i * T.evLen;
          if (i > 0) {
            tl.to(`.ev-item[data-i="${i}"]`, { x: 0, y: 0, scale: 1, opacity: 1, duration: 3 }, s);
            tl.to(`.ev-item[data-i="${i - 1}"]`, {
              x: slotX(i - 1),
              y: slotY(i - 1),
              scale: MINI_SCALE,
              opacity: MINI_OPACITY,
              duration: 3,
            }, s);
          }
        }

        // ---------- SCENE 05 handoff — the file closes and sinks ----------
        tl.to(['.ev-cap', '.ev-items', '.ev-photos'], { opacity: 0, y: -40, duration: 3 }, T.evEnd);
        tl.to('.casefile', { x: 0, y: () => (mobile ? -ih() * 0.04 : 0), scale: mobile ? 0.78 : 1, opacity: 1, duration: 5 }, T.evEnd - 0.5);
        tl.to('.cf-cover', { xPercent: 0, yPercent: 0, rotate: 0, duration: 3.5 }, T.evEnd + 0.5);
        tl.to(['.stage-frame', '.stage-progress'], { opacity: 0, duration: 1.5 }, T.evEnd + 2);
        tl.to('.casefile', { y: () => ih() * 0.6, opacity: 0, duration: 3, ease: 'power2.in' }, T.evEnd + 3.5);

        // ---------- navigation ----------
        const goto: GotoFn = (target) => {
          if (target === 'verdict') {
            document.querySelector('.verdict')?.scrollIntoView({ behavior: 'smooth' });
            return;
          }
          const time = GOTO_TIMES[target];
          const scrollable = root.offsetHeight - window.innerHeight;
          window.scrollTo({ top: root.offsetTop + (time / T.end) * scrollable, behavior: 'smooth' });
        };
        onReady(goto);
      },
    );
  }, root);

  return () => ctx.revert();
}
