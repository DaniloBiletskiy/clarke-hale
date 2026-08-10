import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../siteConfig';

type Msg = { from: 'bot' | 'user'; text: string; action?: 'verdict' };

const c = siteConfig.consultant;

const MENU_ANSWERS: Record<string, string> = {
  practices: c.answers.practices,
  process: c.answers.process,
  results: c.answers.results,
  fees: c.answers.fees,
  book: c.answers.book,
};

function answerFor(input: string): Msg {
  const s = input.toLowerCase();
  const has = (...words: string[]) => words.some((w) => s.includes(w));

  if (has('corporate', 'm&a', 'merger', 'acquisition', 'company', 'governance'))
    return { from: 'bot', text: `Corporate & M&A — ${siteConfig.practices.items[0].desc}` };
  if (has('dispute', 'litigation', 'arbitration', 'court', 'sue', 'conflict'))
    return { from: 'bot', text: `Dispute Resolution — ${siteConfig.practices.items[1].desc}` };
  if (has('real estate', 'property', 'development', 'leasing', 'building'))
    return { from: 'bot', text: `Real Estate — ${siteConfig.practices.items[2].desc}` };
  if (has('private', 'wealth', 'succession', 'family', 'inherit'))
    return { from: 'bot', text: `Private Clients — ${siteConfig.practices.items[3].desc}` };
  if (has('practice', 'area', 'service', 'what do you do', 'specialis'))
    return { from: 'bot', text: c.answers.practices };
  if (has('process', 'how do you work', 'strategy', 'approach', 'step', 'method'))
    return { from: 'bot', text: c.answers.process };
  if (has('result', 'experience', 'track record', 'success', 'win', 'cases'))
    return { from: 'bot', text: c.answers.results };
  if (has('fee', 'cost', 'price', 'hourly', 'budget', 'expensive'))
    return { from: 'bot', text: c.answers.fees };
  if (has('book', 'consult', 'appointment', 'contact', 'call', 'email', 'meet'))
    return { from: 'bot', text: c.answers.book, action: 'verdict' };
  if (has('hello', 'hi', 'hey', 'good morning', 'good afternoon', 'добрый'))
    return { from: 'bot', text: c.answers.hello };
  return { from: 'bot', text: c.answers.fallback, action: 'verdict' };
}

export function Consultant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: c.greeting }]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer.current);
    };
  }, []);

  const reply = (userText: string, botMsg?: Msg) => {
    setMsgs((m) => [...m, { from: 'user', text: userText }]);
    setTyping(true);
    const answer = botMsg ?? answerFor(userText);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, answer]);
    }, 900);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    setDraft('');
    reply(text);
  };

  const onMenu = (id: string, label: string) => {
    if (typing) return;
    reply(label, { from: 'bot', text: MENU_ANSWERS[id], action: id === 'book' ? 'verdict' : undefined });
  };

  const goVerdict = () => {
    setOpen(false);
    document.querySelector('.verdict')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <button
        className={`ai-tab${open ? ' hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open AI counsel chat"
      >
        <span className="ai-tab-dot" aria-hidden="true" />
        <span className="ai-tab-label">{c.tab}</span>
        <span className="ai-tab-status">{c.status}</span>
      </button>

      <section className={`ai-panel${open ? ' open' : ''}`} aria-label="AI counsel" aria-hidden={!open}>
        <header className="ai-head">
          <div>
            <p className="ai-head-title">{c.title}</p>
            <p className="ai-head-ref">{c.ref}</p>
          </div>
          <button className="ai-close" onClick={() => setOpen(false)} aria-label="Close chat">
            ×
          </button>
        </header>

        <div className="ai-msgs" ref={listRef} aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`ai-msg ${m.from}`}>
              <p>{m.text}</p>
              {m.action === 'verdict' && (
                <button className="ai-action" onClick={goVerdict}>
                  Open consultation form →
                </button>
              )}
            </div>
          ))}
          {typing && (
            <div className="ai-msg bot ai-typing" aria-label="Assistant is typing">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>

        <div className="ai-menu" role="group" aria-label={c.menuLabel}>
          <p className="ai-menu-label">{c.menuLabel}</p>
          <div className="ai-chips">
            {c.menu.map((item) => (
              <button key={item.id} className="ai-chip" onClick={() => onMenu(item.id, item.label)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form className="ai-form" onSubmit={onSubmit}>
          <label htmlFor="ai-input" className="sr-only">
            Your question
          </label>
          <input
            id="ai-input"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={c.inputPlaceholder}
            autoComplete="off"
            tabIndex={open ? 0 : -1}
          />
          <button type="submit" aria-label="Send message" tabIndex={open ? 0 : -1}>
            ↑
          </button>
        </form>
      </section>
    </>
  );
}
