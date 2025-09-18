import React from 'react';

const colors = [
  '#F44336', '#E91E63', '#3F51B5', '#03A9F4',
  '#4CAF50', '#FF9800', '#795548', '#607D8B'
];

function getBackgroundColor(name) {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function UserAvatar({ name = '?', size = 40, className = '' }) {
  const letter = name[0]?.toUpperCase() || '?';
  const bgColor = getBackgroundColor(name);

  return (
    <svg
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      <rect
        width="100%"
        height="100%"
        fill={bgColor}
        rx={size / 2}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        fontSize={size / 2}
        fontWeight="bold"
        fill="#fff"
        fontFamily="sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}
