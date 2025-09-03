import React from "react";

export const BrainIcon: React.FC = () => (
  <div className="w-15 h-15 mx-auto mb-6">
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="30"
        cy="30"
        r="28"
        stroke="url(#gradient1)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <circle cx="20" cy="25" r="4" fill="url(#gradient1)" opacity="0.8" />
      <circle cx="40" cy="25" r="4" fill="url(#gradient2)" opacity="0.8" />
      <circle cx="30" cy="35" r="3" fill="url(#gradient1)" opacity="0.7" />
      <circle cx="15" cy="40" r="2" fill="url(#gradient2)" opacity="0.6" />
      <circle cx="45" cy="40" r="2" fill="url(#gradient1)" opacity="0.6" />
      <path
        d="M20 25 L30 35 L40 25"
        stroke="url(#gradient1)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M15 40 L30 35 L45 40"
        stroke="url(#gradient2)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#8b5cf6" }} />
          <stop offset="100%" style={{ stopColor: "#06b6d4" }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#06b6d4" }} />
          <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
