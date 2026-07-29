import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../types/project';
import { saveSession, getInitials, DEMO_USERS } from '../../services/authService';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, _setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, _setRole] = useState('Administrator');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Reset / OTP Fields
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Feedback State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passStrength = getPasswordStrength(password);

  // OTP Countdown Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const resetFormState = () => {
    setError('');
    setSuccessMsg('');
    setLoading(false);
    setFirstName('');
    setLastName('');
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    resetFormState();
    setMode(newMode);
  };

  // Quick Demo Login
  const handleQuickLogin = (demoUserKey: 'admin' | 'engineer' | 'manager') => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const selectedUser = DEMO_USERS[demoUserKey];
      saveSession(selectedUser, `demo-jwt-token-${demoUserKey}`, true);
      onLoginSuccess(selectedUser);
      setLoading(false);
    }, 400);
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Create user profile
      const userProfile: UserProfile = {
        name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
        email: email.trim(),
        role: 'Administrator',
        initials: getInitials(email.split('@')[0]),
      };

      saveSession(userProfile, 'jwt-session-token-live', rememberMe);
      onLoginSuccess(userProfile);
      setLoading(false);
    }, 600);
  };

  // Submit Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    const computedName = `${firstName.trim()} ${lastName.trim()}`.trim() || fullName.trim();

    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      setError('Please enter your last name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (passStrength < 3) {
      setError('Password is too weak. Please include numbers, uppercase letters, or symbols.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        name: computedName,
        email: email.trim(),
        role,
        initials: getInitials(computedName),
      };

      saveSession(newUser, 'jwt-signup-token-live', true);
      onLoginSuccess(newUser);
      setLoading(false);
    }, 700);
  };

  // Submit Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setResendTimer(60);
      setSuccessMsg(`A 6-digit verification code has been sent to ${email}.`);
      setMode('reset');
    }, 800);
  };

  // Submit Reset Password
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!otpCode || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }
    if (password.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Password reset successfully! You can now log in with your new password.');
      setPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setMode('login');
    }, 800);
  };

  return (
    <div className="auth-container">
      {/* Background Glow Orbs */}
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      {/* Main Glassmorphic Card */}
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" width="22" height="22">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1>AI-First Test DNA</h1>
            <span>Promantus Enterprise Testing Platform</span>
          </div>
        </div>

        {/* Dynamic Mode Titles */}
        <div className="auth-header-text">
          {mode === 'login' && (
            <>
              <h2>Sign in to your account</h2>
              <p>Welcome back! Enter your credentials to access your testing workspaces.</p>
            </>
          )}

          {mode === 'signup' && (
            <>
              <h2>Create an account</h2>
              <p>Join AI-First Test DNA to generate, execute, and analyze enterprise tests.</p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h2>Reset your password</h2>
              <p>Enter your registered email address and we'll send you a password recovery code.</p>
            </>
          )}

          {mode === 'reset' && (
            <>
              <h2>Set new password</h2>
              <p>Enter the verification code sent to your email and choose your new password.</p>
            </>
          )}
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="auth-alert error">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
            {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="field">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  type="email"
                  placeholder="admin@promantus.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => handleSwitchMode('forgot')}
                  style={{ fontSize: '12px', fontWeight: 600 }}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--teal)' }}
                />
                Remember me on this device
              </label>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined spin" style={{ fontSize: '18px' }}>progress_activity</span>
                  Signing In...
                </span>
              ) : (
                'Sign In to Dashboard →'
              )}
            </button>

            {/* Quick Demo Logins */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Or Quick Login As:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-sm btn-ghost"
                  onClick={() => handleQuickLogin('admin')}
                  style={{ fontSize: '11.5px', padding: '6px' }}
                >
                  Admin User
                </button>
              </div>
            </div>

            <div className="auth-footer-note">
              Don't have an account?{' '}
              <button type="button" className="auth-link-bold" onClick={() => handleSwitchMode('signup')}>
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit}>
            {/* Row 1: First Name & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="field">
                <label>First Name *</label>
                <div className="input-icon-wrapper">
                  <span className="material-symbols-outlined input-icon">person</span>
                  <input
                    type="text"
                    placeholder="e.g. Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Last Name *</label>
                <div className="input-icon-wrapper">
                  <span className="material-symbols-outlined input-icon">person_outline</span>
                  <input
                    type="text"
                    placeholder="e.g. Kelly"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Work Email Address */}
            <div className="field">
              <label>Work Email Address *</label>
              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  type="email"
                  placeholder="alex.kelly@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="field">
                <label>Password *</label>
                <div className="input-icon-wrapper">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Confirm Password *</label>
                <div className="input-icon-wrapper">
                  <span className="material-symbols-outlined input-icon">lock_reset</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Real-time Password Strength Indicator */}
            {password && (
              <div style={{ marginTop: '-4px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      style={{
                        height: '4px',
                        flex: 1,
                        borderRadius: '2px',
                        background:
                          passStrength >= step
                            ? passStrength <= 1
                              ? 'var(--danger)'
                              : passStrength === 2
                                ? 'var(--warn)'
                                : passStrength === 3
                                  ? 'var(--teal)'
                                  : 'var(--ok)'
                            : '#E4E9F1',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                  Strength:{' '}
                  {passStrength <= 1 ? (
                    <strong style={{ color: 'var(--danger)' }}>Weak</strong>
                  ) : passStrength === 2 ? (
                    <strong style={{ color: 'var(--warn)' }}>Fair</strong>
                  ) : passStrength === 3 ? (
                    <strong style={{ color: 'var(--teal)' }}>Good</strong>
                  ) : (
                    <strong style={{ color: 'var(--ok)' }}>Strong</strong>
                  )}
                </span>
              </div>
            )}

            {/* Terms & Conditions */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text)', lineHeight: 1.4 }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: 'var(--teal)' }}
                />
                I agree to the <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--teal)', fontWeight: 600 }}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--teal)', fontWeight: 600 }}>Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account & Continue →'}
            </button>

            <div className="auth-footer-note">
              Already have an account?{' '}
              <button type="button" className="auth-link-bold" onClick={() => handleSwitchMode('login')}>
                Log In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit}>
            <div className="field">
              <label>Registered Email Address</label>
              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  type="email"
                  placeholder="admin@promantus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Recovery Code →'}
            </button>

            <div className="auth-footer-note">
              Remember your password?{' '}
              <button type="button" className="auth-link-bold" onClick={() => handleSwitchMode('login')}>
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit}>
            <div className="field">
              <label>6-Digit Verification Code *</label>
              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined input-icon">key</span>
                <input
                  type="text"
                  placeholder="e.g. 849201"
                  value={otpCode}
                  maxLength={6}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ letterSpacing: '4px', fontWeight: 700, fontSize: '16px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  Code sent to <strong style={{ color: 'var(--navy)' }}>{email}</strong>
                </span>
                <button
                  type="button"
                  className="auth-link"
                  disabled={resendTimer > 0}
                  onClick={() => {
                    setResendTimer(60);
                    setSuccessMsg(`Resent new 6-digit code to ${email}`);
                  }}
                  style={{ fontSize: '11.5px', opacity: resendTimer > 0 ? 0.6 : 1 }}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </div>

            <div className="field">
              <label>New Password *</label>
              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="field">
              <label>Confirm New Password *</label>
              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined input-icon">lock_reset</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Updating Password...' : 'Reset Password & Login →'}
            </button>

            <div className="auth-footer-note">
              <button type="button" className="auth-link-bold" onClick={() => handleSwitchMode('login')}>
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
