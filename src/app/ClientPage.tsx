"use client";

import React, { useState } from 'react';
import parse from 'html-react-parser';
import { bodyHtml } from './bodyHtml';

interface MyFormProps {
  formData: { fullName: string; phone: string; email: string; };
  setFormData: React.Dispatch<React.SetStateAction<{ fullName: string; phone: string; email: string; }>>;
  status: "idle" | "loading" | "success" | "error";
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  zaloLink: string;
}

const MyForm: React.FC<MyFormProps> = ({ formData, setFormData, status, handleSubmit, zaloLink }) => {
  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "20px", fontFamily: "var(--montserrat), sans-serif", color: "#000" }}>
        <h1 style={{ 
          fontFamily: "var(--oswald), sans-serif", 
          fontSize: "48px", 
          fontWeight: "900", 
          textTransform: "uppercase", 
          margin: "0 0 20px 0",
          letterSpacing: "2px",
          textDecoration: "underline",
          textDecorationThickness: "5px",
          textUnderlineOffset: "5px"
        }}>
          CHÚC MỪNG!
        </h1>
        
        <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>
          Bạn đã đăng ký thành công, Chúng tôi sẽ gửi toàn bộ lịch học, thông tin quà tặng, tài liệu... cho bạn vào trong <strong>một nhóm zalo duy nhất</strong>
        </p>
        
        <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "15px" }}>
          <strong>Bước cuối cùng:</strong> Để được vào nhóm ZALO lớp học ngay bây giờ; Bạn <span style={{ color: "#007BFF", fontWeight: "bold" }}>bấm nút màu xanh</span> bên dưới
        </p>
        
        <p style={{ fontSize: "14px", fontStyle: "italic", marginBottom: "20px" }}>
          (Nhanh tay chúng tôi chỉ duyệt thành viên trong 3 phút kể từ bây giờ)
        </p>
        
        <a 
          href={zaloLink && zaloLink !== '' ? zaloLink : '#'}
          target={zaloLink && zaloLink !== '' ? "_blank" : "_self"}
          rel="noopener noreferrer"
          style={{ 
            display: "inline-block",
            backgroundColor: "#007BFF", 
            color: "white", 
            padding: "15px 30px", 
            border: "none", 
            borderRadius: "4px", 
            fontSize: "20px", 
            fontWeight: "bold", 
            textDecoration: "none",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          BẤM ĐÂY ĐỂ VÀO NHÓM ZALO
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
      <div>
        <label style={{ fontWeight: 'bold' }}>Họ và Tên *</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div>
        <label style={{ fontWeight: 'bold' }}>Số Điện Thoại *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div>
        <label style={{ fontWeight: 'bold' }}>Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <button 
        type="submit" 
        disabled={status === "loading"}
        style={{ 
          backgroundColor: '#FF0085', 
          color: 'white', 
          padding: '15px', 
          border: 'none', 
          borderRadius: '4px', 
          fontSize: '18px', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}
      >
        {status === "loading" ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐĂNG KÝ"}
      </button>
      {status === "error" && (
        <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          Có lỗi xảy ra, vui lòng thử lại!
        </div>
      )}
    </form>
  );
};

export default function ClientPage({ initialZaloLink = '' }: { initialZaloLink?: string }) {
  const [formData, setFormData] = useState({ fullName: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ fullName: "", phone: "", email: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handlePageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Check if clicked element or any of its parents is a button or has ID starting with 'button-'
    const isButton = target.closest('button') || target.closest('[id^="button-"]');
    if (isButton) {
      e.preventDefault();
      setStatus("idle");
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} onClick={() => setIsModalOpen(false)}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              &times;
            </button>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              Tham gia thử thách Affiliate
            </h3>
            <MyForm 
              formData={formData} 
              setFormData={setFormData} 
              status={status} 
              handleSubmit={handleSubmit} 
              zaloLink={initialZaloLink}
            />
          </div>
        </div>
      )}

      <div onClick={handlePageClick}>
        {parse(bodyHtml)}
      </div>
    </>
  );
}
