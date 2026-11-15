import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Hud from './ui/Hud';
import RecruiterView from './ui/RecruiterView';

// The park (and Phaser) only download when someone opens it.
const Park = lazy(() => import('./ui/Park'));

const PARK_HASH = '#park';
// #park opens the park; #park/<exhibit> opens it at that exhibit.
const isParkHash = () =>
  window.location.hash === PARK_HASH || window.location.hash.startsWith(`${PARK_HASH}/`);
const exhibitFromHash = () => window.location.hash.split('/')[1] || null;

const App = () => {
  const [parkOpen, setParkOpen] = useState(isParkHash);
  // Read once when the park opens; the park rewrites the hash as you explore.
  const [parkStart, setParkStart] = useState(exhibitFromHash);

  // #park is a shareable deep link, and Back closes the park.
  useEffect(() => {
    const onHash = () => {
      setParkStart(exhibitFromHash());
      setParkOpen(isParkHash());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Freeze the page behind the park.
  useEffect(() => {
    document.body.style.overflow = parkOpen ? 'hidden' : '';
  }, [parkOpen]);

  const exitPark = useCallback(() => {
    if (isParkHash()) window.history.pushState(null, '', window.location.pathname + window.location.search);
    setParkOpen(false);
  }, []);

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <Hud />
      <div inert={parkOpen}>
        <RecruiterView />
      </div>
      {parkOpen && (
        <Suspense fallback={<p className="park-loading park-loading-fixed">Opening the gates…</p>}>
          <Park onExit={exitPark} initialExhibit={parkStart} />
        </Suspense>
      )}
    </>
  );
};

export default App;
