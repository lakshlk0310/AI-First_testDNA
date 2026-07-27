import React, { useState, useEffect, useRef } from 'react';
import type { UserProfile } from '../../types/project';

interface NavbarProps {
  title?: string;
  user: UserProfile;
  onSignOut?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = 'Solution Portfolio',
  user,
  onSignOut,
  showBackButton = false,
  onBack,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="topbar">
      {/* Left section with optional Back button & Brand Logo */}
      <div className="topbar-brand">
        {showBackButton && (
          <button
            className="btn-sm btn-ghost"
            onClick={onBack}
            style={{
              padding: '6px',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Back to Project Workspace"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" width="18" height="18">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="topbar-title">{title}</h2>
        </div>
      </div>

      {/* Right section with User Profile dropdown */}
      <div className="topbar-actions">
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            title={user.name}
          >
            <div className="avatar-sm">{user.initials}</div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-header">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
              <hr />
              <a
                href="#logout"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                  onSignOut?.();
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginRight: '8px' }}
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign Out
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
