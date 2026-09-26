"use client";

import React, { useState } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid #ddd',
  borderRadius: '10px',
  fontFamily: 'inherit',
  fontSize: '16px',
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        // Chỉ quay về đường dẫn nội bộ trong /cms để tránh chuyển hướng ra trang lạ
        const next = new URLSearchParams(window.location.search).get('next');
        window.location.href = next && next.startsWith('/cms') ? next : '/cms';
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Đăng nhập thất bại.');
    } catch {
      setError('Không kết nối được máy chủ.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '16px', background: 'linear-gradient(160deg, #fde2ec, #fff5f8)', fontFamily: 'var(--montserrat), Montserrat, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '380px', background: '#fff', padding: '32px 28px', borderRadius: '18px', boxShadow: '0 24px 60px -24px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, textAlign: 'center' }}>Đăng nhập quản trị</h1>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666', textAlign: 'center' }}>Nga Leader · CMS</p>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
          Tài khoản
          <input style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
          Mật khẩu
          <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <div role="alert" style={{ padding: '10px 12px', borderRadius: '10px', background: '#fdecec', color: '#c62828', fontSize: '14px' }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: '6px', padding: '14px', border: 'none', borderRadius: '12px', background: 'linear-gradient(180deg,#46ad88,#3a9474)', color: '#fff', fontSize: '16px', fontWeight: 800, fontFamily: 'inherit', cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
