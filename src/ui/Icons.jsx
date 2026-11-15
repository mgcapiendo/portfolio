// Small inline icons. They inherit color from the surrounding text and are
// hidden from screen readers; the link or button around them carries the label.

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 16 16',
  'aria-hidden': true,
  focusable: false,
};

// The "in" is cut out of the square (evenodd), so it shows whatever is behind
// the icon instead of depending on a matching background color.
export const LinkedInIcon = () => (
  <svg {...base}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3 1h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM4.75 3.35a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 1 0 0-2.5zM3.6 6.6h2.3v6H3.6zM7.4 6.6h2.2v.9c.35-.6 1.1-1.05 2.05-1.05 1.6 0 2.35 1 2.35 2.75v3.4h-2.3V9.6c0-.8-.3-1.3-1-1.3-.75 0-1.05.55-1.05 1.3v3H7.4z"
    />
  </svg>
);

export const GitHubIcon = () => (
  <svg {...base}>
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);

export const MailIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
    <path d="M2 4l6 4.75L14 4" />
  </svg>
);

export const FileIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M4 1.5h5.5L13 5v9.5H4z" />
    <path d="M9.5 1.5V5H13M6 8.5h5M6 11h5" />
  </svg>
);
