import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * OAuthCallback — handles the redirect from the backend after OAuth.
 * The backend redirects here with ?token=<jwt>
 * We store the token then send the user home.
 */
const OAuthCallback = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token  = params.get('token');
    const error  = params.get('error');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/', { replace: true });
    } else {
      // Redirect to login with an error message
      navigate('/login', {
        replace: true,
        state: { error: error === 'google_failed' ? 'Google sign-in failed. Please try again.'
                      : error === 'github_failed' ? 'GitHub sign-in failed. Please try again.'
                      : 'OAuth sign-in failed. Please try again.' }
      });
    }
  }, [location, navigate]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{
        width: 40, height: 40, border: '3px solid rgba(88,166,255,0.2)',
        borderTopColor: '#58a6ff', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)' }}>Signing you in…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OAuthCallback;
