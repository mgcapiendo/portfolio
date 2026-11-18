import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  certifications,
  education,
  formatDay,
  formatRange,
  involvement,
  press,
  profile,
  projects,
  roles,
  skills,
} from '../content/content';
import { emit, on } from '../game/bus';
import { isSoundOn, setSound, sfx } from '../game/sound';
import { MAP_SIZE, parkMapImage, youIcon } from '../game/art/parkMap';
import { EXHIBITS, GROUPS, TILE } from '../game/map';
import EmailLink from './EmailLink';
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

// Choktopia: the walkable park. Phaser draws the world into the host
// div; everything readable is React, built from content.ts.

const STAMPS_KEY = 'choktopia-stamps';

// Per-visitor convenience only; the park works the same without storage.
const loadStamps = () => {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(STAMPS_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

const saveStamps = (stamps) => {
  try {
    window.localStorage.setItem(STAMPS_KEY, JSON.stringify([...stamps]));
  } catch {
    // Storage blocked (private mode, etc.): stamps just won't persist.
  }
};

const COMPLETE_KEY = 'choktopia-complete';

// The "every stamp" card shows once per visitor.
const completionSeen = () => {
  try {
    return window.localStorage.getItem(COMPLETE_KEY) === 'yes';
  } catch {
    return false;
  }
};

const markCompletionSeen = () => {
  try {
    window.localStorage.setItem(COMPLETE_KEY, 'yes');
  } catch {
    // Storage blocked: the card may show again next visit.
  }
};

const byId = (list, id) => list.find((item) => item.id === id);

const Bullets = ({ items }) =>
  items.length > 0 && (
    <ul className="bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

const Tags = ({ items }) => (
  <ul className="tags" aria-label="Tech and topics">
    {items.map((tag) => (
      <li key={tag} className="tag">
        {tag}
      </li>
    ))}
  </ul>
);

const Header = ({ place, title, sub }) => (
  <>
    <p className="eyebrow">{place}</p>
    <h2 id="exhibit-title">{title}</h2>
    {sub && <p className="card-org">{sub}</p>}
  </>
);

// One renderer per kind of exhibit.
const PANELS = {
  visitor: (exhibit) => {
    const companies = [...new Set(roles.map((role) => role.company))];
    return (
      <>
        <Header place={exhibit.name} title="Welcome to Choktopia" />
        <p className="highlight">{profile.intro}</p>
        <p className="exhibit-note">{profile.bio}</p>
        <dl className="exhibit-facts">
          <div>
            <dt>Education</dt>
            <dd>
              {education.degree}, {education.school}
            </dd>
          </div>
          <div>
            <dt>Graduating</dt>
            <dd>{education.graduation}</dd>
          </div>
          <div>
            <dt>Interned at</dt>
            <dd>{companies.join(', ')}</dd>
          </div>
        </dl>
        <p className="exhibit-note">
          Each paddock holds one chapter of my career, newest near the gate. Walk the loop, or press M to jump
          anywhere.
        </p>
      </>
    );
  },
  role: (exhibit) => {
    const role = byId(roles, exhibit.ref);
    if (!role) return null;
    return (
      <>
        <Header
          place={exhibit.name}
          title={role.title}
          sub={`${role.company}, ${formatRange(role.start, role.end)}`}
        />
        <p className="highlight">{role.summary}</p>
        <Bullets items={role.bullets} />
        <Tags items={role.tags} />
      </>
    );
  },
  project: (exhibit) => {
    const project = byId(projects, exhibit.ref);
    if (!project) return null;
    const when = project.start && project.end ? `, ${formatRange(project.start, project.end)}` : '';
    return (
      <>
        <Header place={exhibit.name} title={project.name} sub={`${project.kind}${when}`} />
        {project.award && <p className="award">🏆 {project.award}</p>}
        <p className="highlight">{project.summary}</p>
        <Bullets items={project.bullets} />
        <Tags items={project.tags} />
        {project.links.length > 0 && (
          <p className="project-links">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label} ↗
              </a>
            ))}
          </p>
        )}
      </>
    );
  },
  involvement: (exhibit) => {
    const item = byId(involvement, exhibit.ref);
    if (!item) return null;
    const when = item.start && item.end ? `, ${formatRange(item.start, item.end)}` : '';
    return (
      <>
        <Header place={exhibit.name} title={item.title} sub={`${item.org}${when}`} />
        <p className="highlight">{item.summary}</p>
        <Bullets items={item.bullets} />
      </>
    );
  },
  skills: (exhibit) => (
    <>
      <Header place={exhibit.name} title="Skills on display" />
      <dl className="exhibit-facts">
        {skills.map(({ group, items }) => (
          <div key={group}>
            <dt>{group}</dt>
            <dd>{items.join(', ')}</dd>
          </div>
        ))}
        <div>
          <dt>Certifications</dt>
          <dd>{certifications.join(', ')}</dd>
        </div>
      </dl>
    </>
  ),
  contact: (exhibit) => (
    <>
      <Header place={exhibit.name} title="Get in touch" />
      <p className="highlight">
        Open to full-time {profile.roles.join(' and ')} roles. The fastest way to reach me is email.
      </p>
      <div className="exhibit-actions">
        <a className="btn btn-cta btn-sm" href={profile.resume} target="_blank" rel="noreferrer">
          <FileIcon />
          View resume
        </a>
        <EmailLink className="btn btn-secondary btn-sm" icon={<MailIcon />} label={profile.email} />
        <a className="btn btn-secondary btn-sm" href={profile.linkedin} target="_blank" rel="noreferrer">
          <LinkedInIcon />
          LinkedIn
        </a>
        <a className="btn btn-secondary btn-sm" href={profile.github} target="_blank" rel="noreferrer">
          <GitHubIcon />
          GitHub
        </a>
      </div>
    </>
  ),
  press: (exhibit) => {
    const item = byId(press, exhibit.ref);
    if (!item) return null;
    return (
      <>
        <Header place={exhibit.name} title={item.title} sub={`${item.outlet}, ${formatDay(item.date)}`} />
        <p className="highlight">{item.summary}</p>
        <p className="project-links">
          <a href={item.href} target="_blank" rel="noreferrer">
            Read the article ↗
          </a>
        </p>
      </>
    );
  },
};

const Dialog = ({ labelledBy, onClose, children, className = '' }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.querySelector('[data-autofocus]')?.focus();
  }, []);
  return (
    <div className="exhibit-backdrop" onClick={onClose}>
      <div
        ref={ref}
        className={`exhibit card ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const ExhibitPanel = ({ exhibit, onClose }) => {
  const render = PANELS[exhibit.kind];
  return (
    <Dialog labelledBy="exhibit-title" onClose={onClose}>
      {render?.(exhibit) ?? <h2 id="exhibit-title">{exhibit.name}</h2>}
      <button
        type="button"
        className="btn btn-secondary btn-sm exhibit-close"
        onClick={onClose}
        data-autofocus
      >
        Back to the park (Esc)
      </button>
    </Dialog>
  );
};

const pct = (value, total) => `${(value / total) * 100}%`;

// Stardew-style park map: the whole park as a picture in a wooden frame,
// a pin on every exhibit (hover or focus shows its name, click to travel)
// and the ranger where you are. The list below covers keyboards and screen
// readers and works as a legend.
const MapMenu = ({ stamps, player, onTravel, onClose }) => {
  const [mapSrc] = useState(parkMapImage);
  const firstId = EXHIBITS.find((e) => e.group === GROUPS[0]).id;
  return (
    <Dialog labelledBy="map-title" onClose={onClose} className="map-menu">
      <div className="map-head">
        <h2 id="map-title">Where to?</h2>
        <p className="eyebrow">
          Park guide: {stamps.size} of {EXHIBITS.length} stamps
        </p>
      </div>

      <div className="park-map">
        <img src={mapSrc} alt="" className="park-map-img" draggable="false" />
        {EXHIBITS.map((e) => {
          const [sx, sy] = e.sign;
          return (
            <button
              key={e.id}
              type="button"
              className={stamps.has(e.id) ? 'map-pin is-visited' : 'map-pin'}
              style={{ left: pct((sx + 0.5) * TILE, MAP_SIZE.w), top: pct((sy + 0.5) * TILE, MAP_SIZE.h) }}
              onClick={() => onTravel(e.id)}
              aria-label={`Travel to ${e.name}`}
              data-autofocus={e.id === firstId ? true : undefined}
            >
              <span className="map-pin-label" aria-hidden="true">
                {e.name}
              </span>
            </button>
          );
        })}
        {player && (
          <span
            className="map-you"
            style={{ left: pct(player.x, MAP_SIZE.w), top: pct(player.y, MAP_SIZE.h) }}
            aria-hidden="true"
          >
            <img src={youIcon()} alt="" />
            <span>You</span>
          </span>
        )}
      </div>

      {GROUPS.map((group) => (
        <div key={group} className="map-group">
          <h3>{group}</h3>
          <ul>
            {EXHIBITS.filter((e) => e.group === group).map((e) => (
              <li key={e.id}>
                <button type="button" className="map-stop" onClick={() => onTravel(e.id)}>
                  <span>{e.name}</span>
                  {stamps.has(e.id) && (
                    <span className="map-stamp" aria-label="visited">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm exhibit-close" onClick={onClose}>
        Close (Esc)
      </button>
    </Dialog>
  );
};

const CompleteCard = ({ onClose }) => (
  <Dialog labelledBy="complete-title" onClose={onClose}>
    <p className="eyebrow">Park guide</p>
    <h2 id="complete-title">Every stamp collected!</h2>
    <p className="highlight">
      You visited all {EXHIBITS.length} exhibits in Choktopia. Thanks for exploring my career one paddock at a
      time.
    </p>
    <p className="exhibit-note">If you would like to talk, here is the fastest way to reach me.</p>
    <div className="exhibit-actions">
      <a className="btn btn-cta btn-sm" href={profile.resume} target="_blank" rel="noreferrer">
        <FileIcon />
        View resume
      </a>
      <EmailLink className="btn btn-secondary btn-sm" icon={<MailIcon />} label="Email me" copiedLabel="Email copied" />
      <a className="btn btn-secondary btn-sm" href={profile.linkedin} target="_blank" rel="noreferrer">
        <LinkedInIcon />
        LinkedIn
      </a>
    </div>
    <button type="button" className="btn btn-secondary btn-sm exhibit-close" onClick={onClose} data-autofocus>
      Keep exploring (Esc)
    </button>
  </Dialog>
);

const setHash = (hash) => window.history.replaceState(null, '', hash);

const Park = ({ onExit, initialExhibit }) => {
  const hostRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [near, setNear] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [playerPos, setPlayerPos] = useState(null);
  const [stamps, setStamps] = useState(loadStamps);
  const [soundOn, setSoundOn] = useState(isSoundOn);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [helpVisible, setHelpVisible] = useState(true);

  // The controls hint fades after a while so it does not cover the park.
  useEffect(() => {
    const timer = window.setTimeout(() => setHelpVisible(false), 12000);
    return () => window.clearTimeout(timer);
  }, []);
  const stampsRef = useRef(stamps);
  const completeDue = useRef(false);

  const openExhibit = useCallback((id) => {
    if (!byId(EXHIBITS, id)) return;
    emit('park:pause');
    setOpenId(id);
    setHash(`#park/${id}`);
    sfx.pop();
    if (!stampsRef.current.has(id)) {
      const next = new Set(stampsRef.current).add(id);
      stampsRef.current = next;
      saveStamps(next);
      setStamps(next);
      sfx.chime();
      if (next.size === EXHIBITS.length && !completionSeen()) completeDue.current = true;
    }
  }, []);

  // Start Phaser only now, from its own lazily loaded chunk.
  useEffect(() => {
    let game;
    let cancelled = false;
    const offs = [
      on('park:near', (event) => setNear(event.detail)),
      // Tapped a sign and walked there: open it.
      on('park:arrived', (event) => openExhibit(event.detail.id)),
      on('park:ready', () => {
        // Deep link (#park/<exhibit>): start at that exhibit with it open.
        if (initialExhibit && byId(EXHIBITS, initialExhibit)) {
          emit('park:travel', { id: initialExhibit });
          openExhibit(initialExhibit);
        }
      }),
    ];
    import('../game/createGame').then(({ createGame }) => {
      if (cancelled || !hostRef.current) return;
      game = createGame(hostRef.current);
      setLoading(false);
    });
    return () => {
      cancelled = true;
      offs.forEach((off) => off());
      game?.destroy(true);
    };
  }, [initialExhibit, openExhibit]);

  const closePanel = useCallback(() => {
    setOpenId(null);
    setHash('#park');
    if (completeDue.current) {
      // That was the last stamp: celebrate before going back to the park.
      completeDue.current = false;
      markCompletionSeen();
      setCompleteOpen(true);
      sfx.fanfare();
      return;
    }
    emit('park:resume');
  }, []);

  const closeComplete = useCallback(() => {
    setCompleteOpen(false);
    emit('park:resume');
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSound(next);
    setSoundOn(next);
    if (next) sfx.pop();
  };

  const openMap = useCallback(() => {
    // Ask the scene where the ranger is; it answers synchronously.
    let here = null;
    const off = on('park:here', (event) => {
      here = event.detail;
    });
    emit('park:where');
    off();
    setPlayerPos(here);
    emit('park:pause');
    setMapOpen(true);
    sfx.pop();
  }, []);

  const closeMap = useCallback(() => {
    setMapOpen(false);
    emit('park:resume');
  }, []);

  const travel = (id) => {
    setMapOpen(false);
    emit('park:travel', { id });
    emit('park:resume');
  };

  // Park keyboard shortcuts. Walking is handled by Phaser; everything that
  // opens or closes UI is handled here, where the open/closed state lives.
  // A layout effect re-binds before paint, so a key pressed the moment the
  // "Read" prompt appears already sees the new state.
  useLayoutEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        if (completeOpen) closeComplete();
        else if (mapOpen) closeMap();
        else if (openId) closePanel();
        else onExit();
        return;
      }
      if (mapOpen || openId || completeOpen || event.repeat) return;
      const key = event.key.toLowerCase();
      // Enter/Space only count when no button or link has focus.
      const onControl = event.target instanceof Element && event.target.closest('button, a');
      if (key === 'm') {
        openMap();
      } else if (near && (key === 'e' || ((key === 'enter' || key === ' ') && !onControl))) {
        event.preventDefault();
        openExhibit(near.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    mapOpen,
    openId,
    completeOpen,
    near,
    closeMap,
    closePanel,
    closeComplete,
    onExit,
    openMap,
    openExhibit,
  ]);

  const openExhibitData = openId && byId(EXHIBITS, openId);

  return (
    <section className="park band-navy" aria-label="Choktopia, the walkable park">
      <div ref={hostRef} className="park-host" aria-hidden="true" />

      <div className="park-bar">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onExit}>
          ← Back to portfolio
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={openMap}>
          Map <span className="park-help-desktop">(M)</span>
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={toggleSound}
          aria-pressed={soundOn}
        >
          Sound: {soundOn ? 'on' : 'off'}
        </button>
        <p className="park-title">Choktopia</p>
        <p className="park-stamps" aria-live="polite">
          {stamps.size}/{EXHIBITS.length} stamps
        </p>
      </div>

      <p className={helpVisible ? 'park-help' : 'park-help is-faded'}>
        <span className="park-help-desktop">WASD or arrow keys to walk, E to read, M for the map.</span> Tap
        anywhere to walk there, or tap a sign to read it.
      </p>

      {loading && <p className="park-loading">Opening the gates…</p>}

      {near && !openId && !mapOpen && !completeOpen && (
        <div className="park-prompt" role="status">
          <span className="park-prompt-name">{near.name}</span>
          <button type="button" className="btn btn-cta btn-sm" onClick={() => openExhibit(near.id)}>
            Read <span className="park-help-desktop">(E)</span>
          </button>
        </div>
      )}

      {openExhibitData && <ExhibitPanel exhibit={openExhibitData} onClose={closePanel} />}
      {mapOpen && <MapMenu stamps={stamps} player={playerPos} onTravel={travel} onClose={closeMap} />}
      {completeOpen && <CompleteCard onClose={closeComplete} />}
    </section>
  );
};

export default Park;
