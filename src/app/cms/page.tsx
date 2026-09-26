"use client";

import React, { useEffect, useMemo, useState } from 'react';

interface Lead {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
}

// "YYYY-MM-DD" theo giờ máy người dùng (giá trị của <input type="date">)
const toInputDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const filterInputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontFamily: 'inherit',
  fontSize: '14px',
};

const presetButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  background: '#fff',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '13px',
};

export default function CMSPage() {
  const [zaloLink, setZaloLink] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

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

  const filteredLeads = useMemo(() => {
    // Khoảng ngày tính trọn ngày theo giờ địa phương: từ 00:00 "Từ ngày" đến 23:59:59 "Đến ngày"
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : -Infinity;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : Infinity;
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const t = new Date(lead.createdAt).getTime();
      if (t < from || t > to) return false;
      if (!q) return true;
      return [lead.fullName, lead.phone, lead.email].some((v) => v.toLowerCase().includes(q));
    });
  }, [leads, fromDate, toDate, search]);

  const applyPreset = (days: number | null) => {
    if (days === null) {
      setFromDate('');
      setToDate('');
      return;
    }
    setFromDate(toInputDate(daysAgo(days)));
    setToDate(toInputDate(new Date()));
  };

  const handleExport = async () => {
    if (filteredLeads.length === 0) return;
    setIsExporting(true);
    try {
      const { default: writeExcelFile } = await import('write-excel-file/browser');
      const header = (value: string) => ({ value, fontWeight: 'bold' as const });
      // Excel không có múi giờ: dời sang giờ địa phương để file hiện đúng giờ như trên CMS
      const localTime = (iso: string) => {
        const d = new Date(iso);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      };
      const columns = [
        { header: header('STT'), cell: (_: Lead, i: number) => ({ value: i + 1 }), width: 6 },
        { header: header('Họ và Tên'), cell: (l: Lead) => ({ value: l.fullName }), width: 28 },
        { header: header('Số Điện Thoại'), cell: (l: Lead) => ({ value: l.phone, type: String }), width: 18 },
        { header: header('Email'), cell: (l: Lead) => ({ value: l.email }), width: 32 },
        {
          header: header('Thời Gian Đăng Ký'),
          cell: (l: Lead) => ({ value: localTime(l.createdAt), type: Date, format: 'dd/mm/yyyy hh:mm:ss' }),
          width: 22,
        },
      ];
      const range = fromDate || toDate ? `_${fromDate || 'dau'}_den_${toDate || 'nay'}` : '';
      await writeExcelFile(filteredLeads, { columns, sheet: 'Nguoi dang ky' }).toFile(
        `danh-sach-dang-ky${range}.xlsx`
      );
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
      alert('Không xuất được file Excel, vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
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

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '12px', marginBottom: '12px', padding: '16px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: 600 }}>
            Từ ngày
            <input type="date" value={fromDate} max={toDate || undefined} onChange={(e) => setFromDate(e.target.value)} style={filterInputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: 600 }}>
            Đến ngày
            <input type="date" value={toDate} min={fromDate || undefined} onChange={(e) => setToDate(e.target.value)} style={filterInputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: 600, flex: '1 1 200px' }}>
            Tìm kiếm
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tên, số điện thoại, email..." style={filterInputStyle} />
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button type="button" onClick={() => applyPreset(0)} style={presetButtonStyle}>Hôm nay</button>
            <button type="button" onClick={() => applyPreset(6)} style={presetButtonStyle}>7 ngày</button>
            <button type="button" onClick={() => applyPreset(29)} style={presetButtonStyle}>30 ngày</button>
            <button type="button" onClick={() => { applyPreset(null); setSearch(''); }} style={presetButtonStyle}>Tất cả</button>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || filteredLeads.length === 0}
            style={{
              padding: '9px 18px',
              border: 'none',
              borderRadius: '6px',
              background: filteredLeads.length === 0 ? '#9ccfb3' : '#1d7a4f',
              color: '#fff',
              fontWeight: 'bold',
              fontFamily: 'inherit',
              cursor: filteredLeads.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {isExporting ? 'Đang xuất...' : '⬇ Xuất Excel'}
          </button>
        </div>

        <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#555' }}>
          Hiển thị <strong>{filteredLeads.length}</strong> / {leads.length} người đăng ký
        </p>

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
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    {leads.length === 0 ? 'Chưa có người đăng ký nào.' : 'Không có người đăng ký nào trong khoảng đã chọn.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
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
