import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { profile } from '../content/content';

// Copies the address and shows the shared "Email address copied" toast.
// Returns [copied, copy, toast]; render `toast` once inside the component.
const useCopyEmail = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () =>
    navigator.clipboard?.writeText(profile.email).then(
      () => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 3000);
      },
      () => {},
    );

  const toast = createPortal(
    <div className={`email-toast${copied ? ' is-shown' : ''}`} role="status">
      {copied && (
        <>
          Email address copied: <strong>{profile.email}</strong>
        </>
      )}
    </div>,
    document.body,
  );

  return [copied, copy, toast];
};

// A mailto: link does nothing on computers with no default mail app (common
// for people who use Gmail or Outlook in the browser). So every email link
// also copies the address and says so, and the click is never a dead end.
const EmailLink = ({ className, icon, label, copiedLabel = label }) => {
  const [copied, copy, toast] = useCopyEmail();

  return (
    <>
      {/* The default action still runs, so a mail app opens where there is one. */}
      <a className={className} href={`mailto:${profile.email}`} onClick={copy}>
        {icon}
        {copied ? copiedLabel : label}
      </a>
      {toast}
    </>
  );
};

// The Contact section's "Copy" button: same toast, no mail app.
export const CopyEmailButton = ({ className }) => {
  const [copied, copy, toast] = useCopyEmail();

  return (
    <>
      <button type="button" className={className} onClick={copy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {toast}
    </>
  );
};

export default EmailLink;
