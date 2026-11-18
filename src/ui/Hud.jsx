import { profile } from '../content/content';
import EmailLink from './EmailLink';
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

const SECTIONS = [
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
];

// Always-visible bar: resume and contact are one click away from anywhere.
const Hud = () => (
  <header className="hud">
    <div className="hud-inner wrap">
      <a className="hud-brand" href="#top" aria-label={`${profile.name}, back to top`}>
        <span className="footprint" aria-hidden="true" />
        <span className="hud-name">{profile.name}</span>
      </a>

      <nav className="hud-nav" aria-label="Sections">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <div className="hud-actions">
        <a className="icon-link" href={profile.linkedin} target="_blank" rel="noreferrer">
          <LinkedInIcon />
          <span className="icon-label">LinkedIn</span>
        </a>
        <a className="icon-link" href={profile.github} target="_blank" rel="noreferrer">
          <GitHubIcon />
          <span className="icon-label">GitHub</span>
        </a>
        <EmailLink
          className="icon-link"
          icon={<MailIcon />}
          label={<span className="icon-label">Email</span>}
          copiedLabel={<span className="icon-label">Copied</span>}
        />
        <a className="btn btn-cta btn-sm" href={profile.resume} target="_blank" rel="noreferrer">
          <FileIcon />
          Resume
        </a>
      </div>
    </div>
  </header>
);

export default Hud;
