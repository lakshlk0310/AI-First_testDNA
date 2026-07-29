import React from 'react';

interface TestDNAIconProps {
  size?: number | string;
  className?: string;
  variant?: 'red' | 'teal' | 'gradient' | 'white';
}

export const TestDNAIcon: React.FC<TestDNAIconProps> = ({
  size = 24,
  className = '',
  variant = 'red',
}) => {
  // Stable component unique id for SVG defs
  const gradId = 'testDnaBrandGradient';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`${gradId}_red`} x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF233C" />
          <stop offset="50%" stopColor="#D90429" />
          <stop offset="100%" stopColor="#9B041E" />
        </linearGradient>

        <linearGradient id={`${gradId}_teal`} x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#02C39A" />
          <stop offset="50%" stopColor="#028090" />
          <stop offset="100%" stopColor="#005F73" />
        </linearGradient>

        <linearGradient id={`${gradId}_grad`} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D90429" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#028090" />
        </linearGradient>
      </defs>

      {/* Hexagonal AI Automation Shield Outline */}
      <path
        d="M18 3.5L29.5 10.2V23.8L18 30.5L6.5 23.8V10.2L18 3.5Z"
        fill={
          variant === 'red'
            ? 'rgba(217, 4, 41, 0.08)'
            : variant === 'teal'
              ? 'rgba(2, 128, 144, 0.08)'
              : 'rgba(255, 255, 255, 0.12)'
        }
        stroke={
          variant === 'red'
            ? 'rgba(217, 4, 41, 0.25)'
            : variant === 'teal'
              ? 'rgba(2, 128, 144, 0.25)'
              : 'rgba(255, 255, 255, 0.3)'
        }
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* DNA Helix Strand 1 */}
      <path
        d="M11 11.5C14.5 11.5 15.5 18 18 18C20.5 18 21.5 24.5 25 24.5"
        stroke={
          variant === 'red'
            ? `url(#${gradId}_red)`
            : variant === 'teal'
              ? `url(#${gradId}_teal)`
              : variant === 'gradient'
                ? `url(#${gradId}_grad)`
                : '#FFFFFF'
        }
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* DNA Helix Strand 2 */}
      <path
        d="M25 11.5C21.5 11.5 20.5 18 18 18C15.5 18 14.5 24.5 11 24.5"
        stroke={
          variant === 'red'
            ? `url(#${gradId}_red)`
            : variant === 'teal'
              ? `url(#${gradId}_teal)`
              : variant === 'gradient'
                ? `url(#${gradId}_grad)`
                : '#FFFFFF'
        }
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* DNA Helix Base Pairs / Connections */}
      <line
        x1="13"
        y1="14"
        x2="23"
        y2="14"
        stroke={
          variant === 'red'
            ? '#D90429'
            : variant === 'teal'
              ? '#028090'
              : '#FFFFFF'
        }
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <line
        x1="13"
        y1="22"
        x2="23"
        y2="22"
        stroke={
          variant === 'red'
            ? '#D90429'
            : variant === 'teal'
              ? '#028090'
              : '#FFFFFF'
        }
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />

      {/* AI Spark Star at Top Right Node */}
      <path
        d="M25 6C25 8.2 26.8 10 29 10C26.8 10 25 11.8 25 14C25 11.8 23.2 10 21 10C23.2 10 25 8.2 25 6Z"
        fill={
          variant === 'red'
            ? '#D90429'
            : variant === 'teal'
              ? '#02C39A'
              : '#FFFFFF'
        }
      />

      {/* Automated Testing Checkmark Core Badge */}
      <circle
        cx="18"
        cy="18"
        r="4.2"
        fill={
          variant === 'red'
            ? '#D90429'
            : variant === 'teal'
              ? '#028090'
              : '#FFFFFF'
        }
      />
      <path
        d="M16.2 18L17.4 19.2L19.8 16.8"
        stroke={variant === 'white' ? '#0F172A' : '#FFFFFF'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
