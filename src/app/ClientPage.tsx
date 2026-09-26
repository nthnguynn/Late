"use client";

import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { bodyHtml } from './bodyHtml';
import styles from './ClientPage.module.css';

type FormData = { fullName: string; phone: string; email: string; };
type Status = "idle" | "loading" | "success" | "error";

interface MyFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  status: Status;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  zaloLink: string;
}

const MyForm: React.FC<MyFormProps> = ({ formData, setFormData, status, handleSubmit, zaloLink }) => {
  if (status === "success") {
    const hasZalo = zaloLink !== '' && zaloLink !== '#';
    return (
      <div className={styles.success}>
        <div className={styles.successIcon} aria-hidden="true">✓</div>
        <h2 className={styles.successTitle}>Chúc mừng!</h2>
        <p className={styles.successText}>
          Bạn đã đăng ký thành công. Toàn bộ lịch học, quà tặng và tài liệu sẽ được gửi vào{' '}
          <strong>một nhóm Zalo duy nhất</strong>.
        </p>
        <p className={styles.successText}>
          <strong>Bước cuối cùng:</strong> bấm nút xanh bên dưới để vào nhóm Zalo lớp học ngay bây giờ.
        </p>
        <a
          className={styles.zaloButton}
          href={hasZalo ? zaloLink : '#'}
          target={hasZalo ? "_blank" : "_self"}
          rel="noopener noreferrer"
        >
          Bấm vào đây để vào nhóm Zalo
        </a>
        <p className={styles.successNote}>(Chúng tôi chỉ duyệt thành viên trong 3 phút kể từ bây giờ)</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        <span className={styles.label}>Họ và tên</span>
        <input
          className={styles.input}
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Nguyễn Thị A"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Số điện thoại (Zalo)</span>
        <input
          className={styles.input}
          type="tel"
          name="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09xx xxx xxx"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="ban@gmail.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </label>
      <button type="submit" className={styles.submit} disabled={status === "loading"}>
        {status === "loading" ? "Đang xử lý..." : "Hoàn tất đăng ký"}
      </button>
      {status === "error" && (
        <div className={styles.error} role="alert">Có lỗi xảy ra, vui lòng thử lại!</div>
      )}
      <p className={styles.privacy}>🔒 Thông tin của bạn được bảo mật tuyệt đối.</p>
    </form>
  );
};

export default function ClientPage({ initialZaloLink = '' }: { initialZaloLink?: string }) {
  const [formData, setFormData] = useState<FormData>({ fullName: "", phone: "", email: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setStatus("idle");
    setIsModalOpen(true);
  };

  // Khoá cuộn trang và cho phép đóng bằng phím Esc khi popup đang mở
  useEffect(() => {
    if (!isModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsModalOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isModalOpen]);

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
    } catch {
      setStatus("error");
    }
  };

  const handlePageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Check if clicked element or any of its parents is a button or has ID starting with 'button-'
    const isButton = target.closest('button') || target.closest('[id^="button-"]');
    if (isButton) {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nga-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={() => setIsModalOpen(false)} aria-label="Đóng">
              &times;
            </button>
            {status !== "success" && (
              <div className={styles.header}>
                <span className={styles.badge}>Miễn phí · Chỉ 7 suất</span>
                <h3 id="nga-modal-title" className={styles.title}>Tham gia thử thách 2 ngày Affiliate</h3>
                <p className={styles.subtitle}>Điền thông tin để giữ chỗ và nhận bộ quà tặng 125.970.000đ</p>
              </div>
            )}
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

      {!isModalOpen && (
        <div className={styles.stickyBar}>
          <button type="button" className={styles.stickyButton} onClick={openModal}>
            Đăng ký miễn phí ngay
            <small>Chỉ còn 7 suất · Nhận quà 125.970.000đ</small>
          </button>
        </div>
      )}
    </>
  );
}
