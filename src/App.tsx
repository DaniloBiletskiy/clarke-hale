import { useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Stage } from './components/Stage';
import { Verdict } from './components/Verdict';
import { Consultant } from './components/Consultant';
import type { GotoFn } from './animation';
import type { NavTarget } from './siteConfig';

export default function App() {
  const gotoRef = useRef<GotoFn | null>(null);

  const handleReady = useCallback((g: GotoFn) => {
    gotoRef.current = g;
  }, []);

  const handleNavigate = useCallback((t: NavTarget) => {
    gotoRef.current?.(t);
  }, []);

  return (
    <div className="app">
      <Header onNavigate={handleNavigate} />
      <main>
        <Stage onReady={handleReady} onNavigate={handleNavigate} />
        <Verdict />
      </main>
      <Consultant />
    </div>
  );
}
