"use client";

import React, { useEffect, useState } from 'react';

interface Lead {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function CMSPage() {
  const [zaloLink, setZaloLink] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch Zalo config
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.zaloLink) {
          setZaloLink(data.zaloLink);
        }
      })
      .catch((err) => console.error(err));

    // Fetch Leads
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeads(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zaloLink }),
      });

      if (res.ok) {
        setMessage('Lưu cấu hình thành công!');
      } else {
        setMessage('Lỗi khi lưu cấu hình.');
      }
    } catch (error) {
      setMessage('Đã xảy ra lỗi.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.toLocaleTimeString('vi-VN')} ${d.toLocaleDateString('vi-VN')}`;
  };

  return (
    <div style={{ fontFamily: 'var(--montserrat), sans-serif', padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Trang Quản Trị (CMS)</h1>

      <section style={{ marginBottom: '50px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Cấu Hình Hệ Thống</h2>
        <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Link Nhóm Zalo</label>
            <input
              type="text"
              value={zaloLink}
              onChange={(e) => setZaloLink(e.target.value)}
              placeholder="Nhập link nhóm Zalo..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                backgroundColor: '#007BFF',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu Cấu Hình'}
            </button>
            {message && <span style={{ marginLeft: '15px', color: message.includes('thành công') ? 'green' : 'red' }}>{message}</span>}
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Danh Sách Người Đăng Ký</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f1f1' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Họ và Tên</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Số Điện Thoại</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chưa có người đăng ký nào.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{lead.id}</td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{lead.fullName}</td>
                    <td style={{ padding: '12px' }}>{lead.phone}</td>
                    <td style={{ padding: '12px' }}>{lead.email}</td>
                    <td style={{ padding: '12px', color: '#555' }}>{formatDate(lead.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
