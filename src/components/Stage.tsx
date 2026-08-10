import { useEffect, useRef } from 'react';
import { siteConfig, type NavTarget } from '../siteConfig';
import { initStory, type GotoFn } from '../animation';

export function Stage({
  onReady,
  onNavigate,
}: {
  onReady: (g: GotoFn) => void;
  onNavigate: (t: NavTarget) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    if (!ref.current) return;
    return initStory(ref.current, (g) => readyRef.current(g));
  }, []);

  const c = siteConfig;

  return (
    <section className="story" ref={ref} aria-label="Case file" id="top">
      <div className="stage">
        <div className="stage-progress" aria-hidden="true">
          <i />
        </div>
        <div className="stage-frame" aria-hidden="true">
          <span className="sf-left">
            {c.brand.name} — Case File {c.caseMeta.no}
          </span>
          <span className="sf-right">{c.caseMeta.status}</span>
        </div>

        {/* SCENE 01 — OPENING STATEMENT */}
        <div className="sc sc-opening" data-scene="opening">
          <div className="op-copy">
            <p className="sc-kicker">{c.hero.kicker}</p>
            <h1 className="op-title">
              {c.hero.titleLines.map((line, i) =>
                i === c.hero.titleLines.length - 1 ? (
                  <em key={i}>
                    {line}
                    <br />
                  </em>
                ) : (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ),
              )}
            </h1>
            <p className="op-sub">{c.hero.sub}</p>
            <div className="op-actions">
              <button className="btn" type="button" onClick={() => onNavigate('verdict')}>
                {c.hero.cta}
              </button>
              <span className="op-hint" aria-hidden="true">
                {c.hero.hint}
              </span>
            </div>
          </div>

          <div className="casefile" aria-hidden="true">
            <div className="cf-inner">
              <div className="cfi-head">
                <span>Matter {c.caseMeta.no}</span>
                <span>Overview</span>
              </div>
              <div className="cfi-lines">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="cfi-grid">
                <span>Strategy</span>
                <span>Dispute</span>
                <span>Corporate</span>
                <span>Private</span>
              </div>
              <div className="cfi-foot">{c.caseMeta.opened}</div>
            </div>
            <div className="cf-cover">
              <div className="cfc-top">
                <span>Case no. {c.caseMeta.no}</span>
                <span>{c.brand.short}</span>
              </div>
              <div className="cfc-media">
                <img src={c.images.cover} alt="" loading="eager" />
              </div>
              <div className="cfc-title">
                Client
                <br />
                Matter
              </div>
              <div className="cfc-tags">Strategy · Dispute · Corporate</div>
              <div className="cfc-stamp">{c.caseMeta.status}</div>
            </div>
          </div>
        </div>

        {/* SCENE 02 — PRACTICE FILES */}
        <div className="sc sc-practices" data-scene="practices">
          <div className="pr-index">
            <p className="sc-kicker">{c.practices.kicker}</p>
            <ul>
              {c.practices.items.map((p, i) => (
                <li key={p.title} data-i={i}>
                  <span>0{i + 1}</span>
                  {p.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="pr-docs">
            {c.practices.items.map((p, i) => (
              <article className="pr-doc" key={p.title} data-i={i}>
                <div className="prd-media">
                  <img src={p.image} alt={p.title} loading="lazy" />
                </div>
                <div className="prd-body">
                  <div className="prd-top">
                    <span className="prd-num">0{i + 1}</span>
                    <span className="prd-ref">{p.ref}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="prd-meta">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SCENE 03 — STRATEGY MAP */}
        <div className="sc sc-strategy" data-scene="strategy">
          <div className="st-info">
            <p className="sc-kicker">{c.strategy.kicker}</p>
            {c.strategy.steps.map((s, i) => (
              <div className="sti" key={s.title} data-i={i}>
                <p className="sti-num">Step 0{i + 1}</p>
                <h3>{s.title}</h3>
                <p className="sti-desc">{s.desc}</p>
                <p className="sti-meta">{s.meta}</p>
              </div>
            ))}
          </div>
          <div className="st-map" aria-hidden="true">
            <div className="st-spine" />
            {[0, 1, 2].map((i) => (
              <div className="st-seg" key={i} data-i={i} />
            ))}
            {c.strategy.steps.map((s, i) => (
              <div className="st-node" key={s.title} data-i={i}>
                <div className="st-frag">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="st-dot">
                  <span>0{i + 1}</span>
                </div>
                <div className="st-label">{s.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SCENE 04 — EVIDENCE */}
        <div className="sc sc-evidence" data-scene="evidence">
          <div className="ev-cap">
            <p className="sc-kicker">{c.evidence.kicker}</p>
            <h2>{c.evidence.heading}</h2>
            <blockquote>
              {c.evidence.quote}
              <cite>{c.evidence.cite}</cite>
            </blockquote>
          </div>
          <div className="ev-items">
            {c.evidence.stats.map((s, i) => (
              <div className="ev-item" key={s.label} data-i={i}>
                <div className="ev-num">
                  <span className="ev-pre">{s.prefix}</span>
                  <span className="ev-count" data-value={s.value}>
                    {s.value}
                  </span>
                  <span className="ev-suf">{s.suffix}</span>
                </div>
                <div className="ev-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="ev-photos" aria-hidden="true">
            <div className="ev-ph ph-a">
              <img src={c.images.evidenceA} alt="" loading="lazy" />
            </div>
            <div className="ev-ph ph-b">
              <img src={c.images.evidenceB} alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
