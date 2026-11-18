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
import EmailLink, { CopyEmailButton } from './EmailLink';
import HeroCursor from './HeroCursor';
import HeroScene from './HeroScene';
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

const Tags = ({ items, label }) => (
  <ul className="tags" aria-label={label}>
    {items.map((item) => (
      <li key={item} className="tag">
        {item}
      </li>
    ))}
  </ul>
);

// Cards show the summary plus the first few bullets; the rest sit behind a
// "More context" toggle so long entries stay scannable.
const VISIBLE_BULLETS = 2;

const BulletList = ({ items }) =>
  items.length > 0 && (
    <ul className="bullets">
      {items.map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  );

const MoreContext = ({ items }) =>
  items.length > 0 && (
    <details className="more">
      <summary>
        <span className="more-icon" aria-hidden="true" />
        <span className="more-closed">More context</span>
        <span className="more-open">Less context</span>
      </summary>
      <BulletList items={items} />
    </details>
  );

const SectionHead = ({ id, eyebrow, title }) => (
  <div className="section-head">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 id={id}>{title}</h2>
  </div>
);

const Hero = () => {
  const [first, ...rest] = profile.name.split(' ');
  const last = rest.join(' ');
  const current = roles.find((role) => role.end === null);
  const companies = [...new Set(roles.map((role) => role.company))];

  return (
    <section className="hero band-navy" aria-labelledby="hero-name">
      <div className="wrap hero-inner">
        <ul className="role-pills" aria-label="Target roles">
          {profile.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <h1 id="hero-name">
          {first} <span className="nick">“{profile.nickname}”</span> {last}
        </h1>
        <p className="hero-intro">{profile.intro}</p>
        <p className="hero-bio">{profile.bio}</p>

        <div className="hero-ctas">
          <a className="btn btn-cta" href={profile.resume} target="_blank" rel="noreferrer">
            <FileIcon />
            View resume
          </a>
          <EmailLink className="btn btn-secondary" icon={<MailIcon />} label="Email me" copiedLabel="Email copied" />
          <a className="btn btn-secondary btn-park" href="#park">
            <span className="footprint" aria-hidden="true" />
            Explore Choktopia
          </a>
        </div>

        <dl className="facts">
          {current && (
            <div className="fact fact-wide">
              <dt>Currently</dt>
              <dd>
                {current.title}
                <span className="fact-sub">{current.company}</span>
              </dd>
            </div>
          )}
          <div className="fact fact-wide">
            <dt>Education</dt>
            <dd>
              B.S. Computer Science, AI minor
              <span className="fact-sub">{education.school}</span>
            </dd>
          </div>
          <div className="fact">
            <dt>Graduating</dt>
            <dd>{education.graduation}</dd>
          </div>
          <div className="fact">
            <dt>Based in</dt>
            <dd>{profile.location}</dd>
          </div>
          <div className="fact fact-wide">
            <dt>Interned at</dt>
            <dd>
              <ul className="fact-list">
                {companies.map((company) => (
                  <li key={company}>{company}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
      <HeroScene />
      <HeroCursor />
    </section>
  );
};

const Experience = () => (
  <section id="experience" className="section" aria-labelledby="experience-h">
    <div className="wrap">
      <SectionHead id="experience-h" title="Experience" />
      <p className="section-aside">
        <a href="#park">Prefer a more interactive experience? Explore my page in Choktopia →</a>
      </p>

      <ol className="role-list">
        {roles.map((role) => (
          <li key={role.id}>
            <article className="card" aria-labelledby={`${role.id}-h`}>
              <div className="card-head">
                <div>
                  <h3 id={`${role.id}-h`}>{role.title}</h3>
                  <p className="card-org">{role.company}</p>
                </div>
                <p className="card-dates">
                  {formatRange(role.start, role.end)}
                  {role.end === null && <span className="badge">Current</span>}
                </p>
              </div>
              <p className="highlight">{role.summary}</p>
              <BulletList items={role.bullets.slice(0, VISIBLE_BULLETS)} />
              <Tags items={role.tags} label={`${role.title} tech and topics`} />
              <MoreContext items={role.bullets.slice(VISIBLE_BULLETS)} />
            </article>
          </li>
        ))}
      </ol>

      <h3 className="sub-h">Leadership, mentorship &amp; community</h3>
      <div className="grid grid-2">
        {involvement.map((item) => (
          <article key={item.id} className="card" aria-labelledby={`${item.id}-h`}>
            <h4 id={`${item.id}-h`}>{item.title}</h4>
            <p className="card-org">{item.org}</p>
            {item.start && item.end && <p className="card-dates">{formatRange(item.start, item.end)}</p>}
            <p className="highlight">{item.summary}</p>
            <BulletList items={item.bullets.slice(0, VISIBLE_BULLETS)} />
            <MoreContext items={item.bullets.slice(VISIBLE_BULLETS)} />
          </article>
        ))}
      </div>

      <h3 className="sub-h">In the news</h3>
      <div className="grid">
        {press.map((item) => (
          <article key={item.id} className="card" aria-labelledby={`${item.id}-h`}>
            <div className="card-head">
              <div>
                <h4 id={`${item.id}-h`}>{item.title}</h4>
                <p className="card-org">{item.outlet}</p>
              </div>
              <p className="card-dates">{formatDay(item.date)}</p>
            </div>
            <p className="highlight">{item.summary}</p>
            <p className="project-links">
              <a href={item.href} target="_blank" rel="noreferrer">
                Read the article ↗
              </a>
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const Projects = () => (
  <section id="projects" className="section band-tint" aria-labelledby="projects-h">
    <div className="wrap">
      <SectionHead id="projects-h" eyebrow="Senior Design and hackathons" title="Projects" />
      <div className="grid grid-2">
        {projects.map((project) => (
          <article key={project.id} className="card project" aria-labelledby={`${project.id}-h`}>
            <div className="card-head">
              <div>
                <h3 id={`${project.id}-h`}>{project.name}</h3>
                <p className="card-org">{project.kind}</p>
              </div>
              {project.start && project.end && (
                <p className="card-dates">{formatRange(project.start, project.end)}</p>
              )}
            </div>
            {project.award && <p className="award">🏆 {project.award}</p>}
            <p className="highlight">{project.summary}</p>
            <ul className="bullets">
              {project.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <Tags items={project.tags} label={`${project.name} tech`} />
            {project.links.length > 0 && (
              <p className="project-links">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label} ↗
                  </a>
                ))}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  </section>
);

const Skills = () => (
  <section id="skills" className="section" aria-labelledby="skills-h">
    <div className="wrap">
      <SectionHead id="skills-h" eyebrow="Education, certifications and tools" title="Skills" />
      <div className="grid grid-2">
        <article className="card" aria-labelledby="education-h">
          <h3 id="education-h">Education</h3>
          <p className="highlight">{education.school}</p>
          <p className="card-org">{education.degree}</p>
          <p className="card-org">Graduating {education.graduation}</p>
        </article>
        <article className="card" aria-labelledby="certs-h">
          <h3 id="certs-h">Certifications</h3>
          <ul className="bullets">
            {certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="grid grid-3 skills-grid">
        {skills.map(({ group, items }) => (
          <div key={group} className="card skill-card">
            <h3>{group}</h3>
            <Tags items={items} label={group} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="section band-navy" aria-labelledby="contact-h">
    <div className="wrap">
      <SectionHead id="contact-h" eyebrow="Let's talk" title="Contact" />
      <div className="card contact-card">
        <p className="highlight">
          Open to full-time {profile.roles.join(' and ')} roles. The fastest way to reach me is email.
        </p>
        <div className="email-row">
          <EmailLink className="email-link" label={profile.email} />
          <CopyEmailButton className="btn btn-secondary btn-sm" />
        </div>
        <div className="contact-links">
          <a className="btn btn-cta" href={profile.resume} target="_blank" rel="noreferrer">
            <FileIcon />
            View resume
          </a>
          <a className="btn btn-secondary" href={profile.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon />
            LinkedIn
          </a>
          <a className="btn btn-secondary" href={profile.github} target="_blank" rel="noreferrer">
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
);

const RecruiterView = () => (
  <>
    <main id="top" tabIndex={-1}>
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </main>
    <footer className="footer">
      <div className="wrap">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  </>
);

export default RecruiterView;
