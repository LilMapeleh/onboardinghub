import type { SVGProps } from "react";

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "home"
    | "path"
    | "tasks"
    | "compass"
    | "people"
    | "calendar"
    | "bell"
    | "close"
    | "check"
    | "arrow"
    | "search"
    | "message"
    | "doc";
  className?: string;
}) {
  const props: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...props}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
      </svg>
    );
  }
  if (name === "path") {
    return (
      <svg {...props}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M8 7c6 0 2 10 8 10" />
      </svg>
    );
  }
  if (name === "tasks") {
    return (
      <svg {...props}>
        <path d="M9 7h10M9 12h10M9 17h10" />
        <path d="m4.5 7 1 1 2-2M4.5 12l1 1 2-2M4.5 17l1 1 2-2" />
      </svg>
    );
  }
  if (name === "compass") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="8" />
        <path d="m14.8 9.2-1.3 4.3-4.3 1.3 1.3-4.3z" />
      </svg>
    );
  }
  if (name === "people") {
    return (
      <svg {...props}>
        <circle cx="9" cy="9" r="2.4" />
        <path d="M4.8 17.5c.6-2.2 2.2-3.3 4.2-3.3s3.6 1.1 4.2 3.3" />
        <circle cx="16.2" cy="9.2" r="1.8" />
        <path d="M15.2 14.3c1.4.2 2.5.9 3.1 2.2" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg {...props}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5V7M16 3.5V7M4 10h16" />
      </svg>
    );
  }
  if (name === "bell") {
    return (
      <svg {...props}>
        <path d="M6 16V11a6 6 0 1 1 12 0v5l1.2 1.5H4.8z" />
        <path d="M10 18.5a2 2 0 0 0 4 0" />
      </svg>
    );
  }
  if (name === "close") {
    return (
      <svg {...props}>
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg {...props}>
        <path d="m5 12 4.2 4.2L19 7.5" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg {...props}>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 3.5 3.5" />
      </svg>
    );
  }
  if (name === "message") {
    return (
      <svg {...props}>
        <path d="M5 6.5h14v9H8.5L5 18.5z" />
      </svg>
    );
  }
  if (name === "doc") {
    return (
      <svg {...props}>
        <path d="M8 3.5h6l4 4V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
        <path d="M14 3.5V8h4M9 13h6M9 16.5h4" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
