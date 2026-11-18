import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { profile } from '../content/content';

// A mailto: link does nothing on computers with no default mail app (common
// for people who use Gmail or Outlook in the browser). So every email link
// also copies the address and says so, and the click is never a dead end.
const EmailLink = ({ className, icon, label, copiedLabel = label }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    // The default action still runs, so a mail app opens where there is one.
    navigator.clipboard?.writeText(profile.email).then(
      () => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 3000);
      },
      () => {},
    );
  };

  return (
    <>
      <a className={className} href={`mailto:${profile.email}`} onClick={copy}>
        {icon}
        {copied ? copiedLabel : label}
      </a>
      {createPortal(
        <div className={`email-toast${copied ? ' is-shown' : ''}`} role="status">
          {copied && (
            <>
              Email address copied: <strong>{profile.email}</strong>
            </>
          )}
        </div>,
        document.body,
      )}
    </>
  );
};

export default EmailLink;
